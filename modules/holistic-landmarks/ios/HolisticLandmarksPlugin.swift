import AVFoundation
import Foundation
import MediaPipeTasksVision
import UIKit
import VisionCamera

/**
 * 프레임 한 장에서 MediaPipe Pose/Hand 정규화 좌표를 뽑아 돌려준다.
 *
 * 서버가 기대하는 규격:
 * - poseLandmarks / handLandmarks(정규화 좌표). world 좌표는 스케일이 달라 쓰지 않는다.
 * - pose 33개는 x, y, z, visibility. 손 21개는 x, y, z.
 * - left/right는 화면이 아니라 찍힌 사람 기준. handedness 문자열은 반전된 셀카를
 *   전제하므로 쓰지 않고, 포즈 손목(15=왼손, 16=오른손)에 가까운 손으로 가른다.
 * - 손이 안 잡히면 빈 배열.
 */
@objc(HolisticLandmarksPlugin)
public class HolisticLandmarksPlugin: FrameProcessorPlugin {
  private static let poseLeftWristIndex = 15
  private static let poseRightWristIndex = 16
  private static let handWristIndex = 0

  private var poseLandmarker: PoseLandmarker?
  private var handLandmarker: HandLandmarker?

  /// VIDEO 모드는 타임스탬프가 계속 커져야 한다. 같아지면 감지가 실패한다.
  private var lastTimestamp = -1

  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
    setUpLandmarkers()
  }

  private func setUpLandmarkers() {
    if let posePath = Self.modelPath(named: "pose_landmarker_lite") {
      let poseOptions = PoseLandmarkerOptions()
      poseOptions.baseOptions.modelAssetPath = posePath
      // 이어지는 영상임을 알려주면 앞 장의 결과로 추적해서 흔들림이 줄어든다.
      poseOptions.runningMode = .video
      poseOptions.numPoses = 1
      poseLandmarker = try? PoseLandmarker(options: poseOptions)
    }

    if let handPath = Self.modelPath(named: "hand_landmarker") {
      let handOptions = HandLandmarkerOptions()
      handOptions.baseOptions.modelAssetPath = handPath
      // 손도 VIDEO 모드가 앞 장의 손 위치를 재사용해 더 빠르고 덜 튄다.
      handOptions.runningMode = .video
      handOptions.numHands = 2
      handLandmarker = try? HandLandmarker(options: handOptions)
    }
  }

  private static func modelPath(named name: String) -> String? {
    let bundle = Bundle(for: HolisticLandmarksPlugin.self)

    if let path = bundle.path(forResource: name, ofType: "task") {
      return path
    }

    // resource_bundles로 묶인 경우 한 단계 안쪽에 있다.
    guard
      let bundlePath = bundle.path(forResource: "HolisticLandmarksModels", ofType: "bundle"),
      let modelsBundle = Bundle(path: bundlePath)
    else {
      return nil
    }

    return modelsBundle.path(forResource: name, ofType: "task")
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    guard poseLandmarker != nil || handLandmarker != nil else { return nil }

    // 감지 전에 좌우를 반전할지. JS가 호출할 때마다 넘겨준다.
    let mirror = arguments?["mirror"] as? Bool ?? false

    guard
      let image = try? MPImage(
        sampleBuffer: frame.buffer,
        orientation: Self.orientation(of: frame, mirror: mirror)
      )
    else {
      return nil
    }

    let timestamp = nextTimestamp(of: frame)
    let pose = detectPose(in: image, at: timestamp)
    let hands = detectHands(in: image, at: timestamp)
    let (left, right) = splitHandsByWrist(hands: hands, pose: pose)

    return [
      "pose": pose,
      "left": left,
      "right": right,
    ]
  }

  /**
   * MediaPipe는 사람이 똑바로 선 이미지를 전제한다.
   *
   * MPImage(sampleBuffer:)는 방향을 .up으로 고정해 회전을 적용하지 않는다.
   * 세로로 든 기기의 샘플 버퍼는 가로로 들어오므로 그대로 넣으면
   * 누운 사람을 감지하게 되고, 좌표계도 학습 데이터와 어긋난다.
   * vision-camera가 준 방향을 넘겨 돌린 사본에서 감지하게 한다.
   *
   * 반전은 들어온 프레임이 이미 반전됐는지와 원하는 상태가 다를 때만 건다.
   * 미러 방향을 넘기면 MediaPipe가 좌우까지 뒤집은 사본에서 감지한다.
   */
  private static func orientation(of frame: Frame, mirror: Bool) -> UIImage.Orientation {
    guard frame.isMirrored != mirror else { return frame.orientation }

    switch frame.orientation {
    case .up: return .upMirrored
    case .down: return .downMirrored
    case .left: return .leftMirrored
    case .right: return .rightMirrored
    case .upMirrored: return .up
    case .downMirrored: return .down
    case .leftMirrored: return .left
    case .rightMirrored: return .right
    @unknown default: return frame.orientation
    }
  }

  /// 프레임 자체의 시각을 쓰되, 같거나 거꾸로 온 장은 1ms씩 밀어 올린다.
  private func nextTimestamp(of frame: Frame) -> Int {
    let timestamp = max(Int(frame.timestamp.rounded()), lastTimestamp + 1)
    lastTimestamp = timestamp

    return timestamp
  }

  private func detectPose(in image: MPImage, at timestamp: Int) -> [[String: Any]] {
    guard
      let result = try? poseLandmarker?.detect(videoFrame: image, timestampInMilliseconds: timestamp),
      let landmarks = result.landmarks.first
    else {
      return []
    }

    return landmarks.map { landmark in
      [
        "x": landmark.x,
        "y": landmark.y,
        "z": landmark.z,
        // presence가 아니라 visibility를 보낸다.
        "visibility": landmark.visibility?.floatValue ?? 0,
      ]
    }
  }

  private func detectHands(in image: MPImage, at timestamp: Int) -> [[[String: Any]]] {
    guard
      let result = try? handLandmarker?.detect(videoFrame: image, timestampInMilliseconds: timestamp)
    else {
      return []
    }

    return result.landmarks.map { landmarks in
      landmarks.map { landmark in
        [
          "x": landmark.x,
          "y": landmark.y,
          "z": landmark.z,
        ]
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
  private func splitHandsByWrist(
    hands: [[[String: Any]]],
    pose: [[String: Any]]
  ) -> ([[String: Any]], [[String: Any]]) {
    let empty: ([[String: Any]], [[String: Any]]) = ([], [])

    guard !hands.isEmpty else { return empty }

    // 포즈를 못 잡았으면 좌우를 가를 기준이 없다.
    guard
      let leftWrist = wristPoint(in: pose, at: Self.poseLeftWristIndex),
      let rightWrist = wristPoint(in: pose, at: Self.poseRightWristIndex)
    else {
      return empty
    }

    // 손목이 안 잡힌 손은 어느 쪽인지 가릴 수 없다.
    let candidates = hands.filter { wristPoint(in: $0, at: Self.handWristIndex) != nil }.prefix(2)

    guard let first = candidates.first, let firstWrist = wristPoint(in: first, at: Self.handWristIndex) else {
      return empty
    }

    guard
      candidates.count > 1,
      let second = candidates.last,
      let secondWrist = wristPoint(in: second, at: Self.handWristIndex)
    else {
      if distance(firstWrist, leftWrist) <= distance(firstWrist, rightWrist) {
        return (first, [])
      }

      return ([], first)
    }

    let straight = distance(firstWrist, leftWrist) + distance(secondWrist, rightWrist)
    let crossed = distance(firstWrist, rightWrist) + distance(secondWrist, leftWrist)

    return straight <= crossed ? (first, second) : (second, first)
  }

  private func wristPoint(in landmarks: [[String: Any]], at index: Int) -> (Float, Float)? {
    guard
      index < landmarks.count,
      let x = landmarks[index]["x"] as? Float,
      let y = landmarks[index]["y"] as? Float
    else {
      return nil
    }

    return (x, y)
  }

  private func distance(_ a: (Float, Float), _ b: (Float, Float)) -> Float {
    let dx = a.0 - b.0
    let dy = a.1 - b.1

    return dx * dx + dy * dy
  }
}
