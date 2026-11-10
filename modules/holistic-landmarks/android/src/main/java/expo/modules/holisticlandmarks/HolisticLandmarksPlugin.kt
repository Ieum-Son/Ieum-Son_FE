package expo.modules.holisticlandmarks

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Matrix
import android.util.Log
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarker
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import java.nio.ByteBuffer

/**
 * 프레임 한 장에서 MediaPipe Pose/Hand 정규화 좌표를 뽑아 돌려준다.
 * ios/HolisticLandmarksPlugin.swift와 같은 모양을 돌려줘야 한다.
 *
 * 서버가 기대하는 규격:
 * - poseLandmarks / handLandmarks(정규화 좌표). world 좌표는 스케일이 달라 쓰지 않는다.
 * - pose 33개는 x, y, z, visibility. 손 21개는 x, y, z.
 * - left/right는 화면이 아니라 찍힌 사람 기준. handedness 문자열은 반전된 셀카를
 *   전제하므로 쓰지 않고, 포즈 손목(15=왼손, 16=오른손)에 가까운 손으로 가른다.
 * - 손이 안 잡히면 빈 배열.
 *
 * 숫자는 반드시 Double로 담는다. JSIJNIConversion이 받는 숫자는 Double과 Integer뿐이고
 * Float은 변환 대상에 없어서 그대로 넣으면 좌표가 JS까지 오지 않는다.
 */
class HolisticLandmarksPlugin(context: Context) : FrameProcessorPlugin() {
  private val poseLandmarker = createPoseLandmarker(context)
  private val handLandmarker = createHandLandmarker(context)

  /** VIDEO 모드는 타임스탬프가 계속 커져야 한다. 같아지면 감지가 실패한다. */
  private var lastTimestamp = -1L

  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
    if (poseLandmarker == null && handLandmarker == null) return null

    // 감지 전에 좌우를 반전할지. JS가 호출할 때마다 넘겨준다.
    val mirror = params?.get("mirror") as? Boolean ?: false

    val bitmap = runCatching { toUprightBitmap(frame, mirror) }
      .onFailure { Log.e(TAG, "프레임을 비트맵으로 바꾸지 못했다", it) }
      .getOrNull() ?: return null

    val image = BitmapImageBuilder(bitmap).build()
    val timestamp = nextTimestamp(frame)

    val pose = detectPose(image, timestamp)
    val hands = detectHands(image, timestamp)
    val (left, right) = splitHandsByWrist(hands, pose)

    return mapOf(
      "pose" to pose,
      "left" to left,
      "right" to right,
    )
  }

  /** 프레임 자체의 시각을 쓰되, 같거나 거꾸로 온 장은 1ms씩 밀어 올린다. */
  private fun nextTimestamp(frame: Frame): Long {
    val timestamp = maxOf(frame.timestamp / NANOS_PER_MILLI, lastTimestamp + 1)
    lastTimestamp = timestamp

    return timestamp
  }

  private fun detectPose(image: MPImage, timestamp: Long): List<Map<String, Any>> {
    val landmarks = runCatching { poseLandmarker?.detectForVideo(image, timestamp) }
      .getOrNull()
      ?.landmarks()
      ?.firstOrNull() ?: return emptyList()

    return landmarks.map { landmark ->
      mapOf(
        "x" to landmark.x().toDouble(),
        "y" to landmark.y().toDouble(),
        "z" to landmark.z().toDouble(),
        // presence가 아니라 visibility를 보낸다.
        "visibility" to landmark.visibility().orElse(0f).toDouble(),
      )
    }
  }

  private fun detectHands(image: MPImage, timestamp: Long): List<List<Map<String, Any>>> {
    val result = runCatching { handLandmarker?.detectForVideo(image, timestamp) }
      .getOrNull() ?: return emptyList()

    return result.landmarks().map { landmarks ->
      landmarks.map { landmark ->
        mapOf(
          "x" to landmark.x().toDouble(),
          "y" to landmark.y().toDouble(),
          "z" to landmark.z().toDouble(),
        )
      }
    }
  }

  /**
   * 포즈 손목에 가까운 손을 그 손목의 손으로 본다.
   * handedness를 쓰면 반전 전 프레임에서 좌우가 뒤바뀐다.
   *
   * 두 손이 다 잡혔으면 한 손도 버리지 않는다.
   * 가슴 앞에서 손을 모으면 둘 다 한쪽 손목에 가까워지는데
   * 가까운 하나만 남기면 그 장만 한 손이 비어 동작이 끊겨 보인다.
   * 그래서 바로 놓기와 엇갈려 놓기 중 거리 합이 작은 쪽을 고른다.
   */
  private fun splitHandsByWrist(
    hands: List<List<Map<String, Any>>>,
    pose: List<Map<String, Any>>,
  ): Pair<List<Map<String, Any>>, List<Map<String, Any>>> {
    val empty = emptyList<Map<String, Any>>() to emptyList<Map<String, Any>>()

    if (hands.isEmpty()) return empty

    // 포즈를 못 잡았으면 좌우를 가를 기준이 없다.
    val leftWrist = wristPoint(pose, POSE_LEFT_WRIST_INDEX) ?: return empty
    val rightWrist = wristPoint(pose, POSE_RIGHT_WRIST_INDEX) ?: return empty

    // 손목이 안 잡힌 손은 어느 쪽인지 가릴 수 없다.
    val candidates = hands.filter { wristPoint(it, HAND_WRIST_INDEX) != null }.take(2)
    val first = candidates.firstOrNull() ?: return empty
    val firstWrist = wristPoint(first, HAND_WRIST_INDEX) ?: return empty

    if (candidates.size < 2) {
      val toLeft = squaredDistance(firstWrist, leftWrist)
      val toRight = squaredDistance(firstWrist, rightWrist)

      return if (toLeft <= toRight) first to empty.second else empty.first to first
    }

    val second = candidates[1]
    val secondWrist = wristPoint(second, HAND_WRIST_INDEX) ?: return empty

    val straight =
      squaredDistance(firstWrist, leftWrist) + squaredDistance(secondWrist, rightWrist)
    val crossed =
      squaredDistance(firstWrist, rightWrist) + squaredDistance(secondWrist, leftWrist)

    return if (straight <= crossed) first to second else second to first
  }

  private fun wristPoint(
    landmarks: List<Map<String, Any>>,
    index: Int,
  ): Pair<Double, Double>? {
    val landmark = landmarks.getOrNull(index) ?: return null
    val x = landmark["x"] as? Double ?: return null
    val y = landmark["y"] as? Double ?: return null

    return x to y
  }

  private fun squaredDistance(a: Pair<Double, Double>, b: Pair<Double, Double>): Double {
    val dx = a.first - b.first
    val dy = a.second - b.second

    return dx * dx + dy * dy
  }

  private fun toUprightBitmap(frame: Frame, mirror: Boolean): Bitmap? {
    val pixels = packPixels(frame) ?: return null
    val bitmap = Bitmap.createBitmap(frame.width, frame.height, Bitmap.Config.ARGB_8888)

    bitmap.copyPixelsFromBuffer(pixels)

    return orient(bitmap, frame, mirror)
  }

  /**
   * pixelFormat="rgb"로 받은 프레임은 RGBA_8888 한 장이다.
   * 행 끝에 패딩이 붙을 수 있고 Bitmap.copyPixelsFromBuffer는 패딩을 모르므로 미리 걷어낸다.
   */
  private fun packPixels(frame: Frame): ByteBuffer? {
    val plane = frame.image.planes.firstOrNull() ?: return null
    val rowBytes = frame.width * BYTES_PER_PIXEL
    val source = plane.buffer

    if (plane.rowStride == rowBytes) {
      source.rewind()

      return source
    }

    val packed = ByteBuffer.allocateDirect(rowBytes * frame.height)
    val row = ByteArray(rowBytes)

    for (y in 0 until frame.height) {
      source.position(y * plane.rowStride)
      source.get(row, 0, rowBytes)
      packed.put(row)
    }

    packed.rewind()

    return packed
  }

  /**
   * MediaPipe는 사람이 똑바로 선 이미지를 전제한다.
   * 안드로이드는 센서 방향 그대로 들어와서 눕혀져 있을 수 있으니 되돌린다.
   *
   * frame.orientation은 바로잡는 데 필요한 회전이 아니라 프레임이 지금 놓인
   * 방향이다(vision-camera가 rotationDegrees를 reversed()해서 준다).
   * 그래서 landscape-right가 "90도 돌려야 바로 선다"는 뜻이다. 뒤집어 읽으면
   * 90과 270이 서로 바뀌어 사람이 거꾸로 선 이미지를 감지하게 된다.
   *
   * 반전은 들어온 프레임이 이미 반전됐는지와 원하는 상태가 다를 때만 건다.
   */
  private fun orient(bitmap: Bitmap, frame: Frame, mirror: Boolean): Bitmap {
    val degrees = when (frame.orientation.unionValue) {
      "landscape-right" -> 90f
      "portrait-upside-down" -> 180f
      "landscape-left" -> 270f
      else -> 0f
    }
    val shouldFlip = frame.isMirrored != mirror

    if (degrees == 0f && !shouldFlip) return bitmap

    val matrix = Matrix().apply {
      if (degrees != 0f) postRotate(degrees)
      if (shouldFlip) postScale(-1f, 1f)
    }

    return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
  }

  private fun createPoseLandmarker(context: Context): PoseLandmarker? = runCatching {
    val options = PoseLandmarker.PoseLandmarkerOptions.builder()
      .setBaseOptions(BaseOptions.builder().setModelAssetPath(POSE_MODEL).build())
      // 이어지는 영상임을 알려주면 앞 장의 결과로 추적해서 흔들림이 줄어든다.
      .setRunningMode(RunningMode.VIDEO)
      .setNumPoses(1)
      .build()

    PoseLandmarker.createFromOptions(context, options)
  }.onFailure { Log.e(TAG, "pose landmarker를 만들지 못했다", it) }.getOrNull()

  private fun createHandLandmarker(context: Context): HandLandmarker? = runCatching {
    val options = HandLandmarker.HandLandmarkerOptions.builder()
      .setBaseOptions(BaseOptions.builder().setModelAssetPath(HAND_MODEL).build())
      // 손도 VIDEO 모드가 앞 장의 손 위치를 재사용해 더 빠르고 덜 튄다.
      .setRunningMode(RunningMode.VIDEO)
      .setNumHands(2)
      .build()

    HandLandmarker.createFromOptions(context, options)
  }.onFailure { Log.e(TAG, "hand landmarker를 만들지 못했다", it) }.getOrNull()

  private companion object {
    const val TAG = "HolisticLandmarks"
    const val POSE_MODEL = "pose_landmarker_lite.task"
    const val HAND_MODEL = "hand_landmarker.task"
    const val POSE_LEFT_WRIST_INDEX = 15
    const val POSE_RIGHT_WRIST_INDEX = 16
    const val HAND_WRIST_INDEX = 0
    const val BYTES_PER_PIXEL = 4
    const val NANOS_PER_MILLI = 1_000_000L
  }
}
