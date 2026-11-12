import { MIRROR_BEFORE_DETECTION } from "@/constants/holistic";

/**
 * @mediapipe/tasks-vision 버전.
 * ios/HolisticLandmarks.podspec, android/build.gradle의 MediaPipe와 같은 버전으로 맞춘다.
 * 세 경로가 같은 모델을 같은 버전으로 돌려야 좌표가 어긋나지 않는다.
 */
const TASKS_VISION_VERSION = "0.10.35";

/**
 * WebView에 심는 페이지.
 *
 * 네이티브 모듈이 없는 환경에서도 수어 인식을 돌리려고
 * getUserMedia로 카메라를 열고 MediaPipe JS로 좌표를 뽑는다.
 * 뽑은 프레임은 모아두지 않고 장마다 RN으로 올려보낸다.
 * RN의 stop()이 동기로 프레임을 돌려줘야 해서, 미리 올려둬야 한다.
 *
 * 돌려주는 좌표 규격은 ios/HolisticLandmarksPlugin.swift와 같아야 한다.
 * - 정규화 좌표만 쓴다. world 좌표는 스케일이 달라 쓰면 안 된다.
 * - pose 33개는 x, y, z, visibility. 손 21개는 x, y, z.
 * - left/right는 handedness가 아니라 포즈 손목(15, 16)에 가까운 손으로 가른다.
 * - 감지 전에 반전할지는 MIRROR_BEFORE_DETECTION이 정한다.
 *   미리보기는 그 값과 무관하게 CSS로 늘 거울로 보여준다.
 */
export const HOLISTIC_WEB_VIEW_HTML = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #000;
        overflow: hidden;
      }

      #preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
        /* 미리보기만 거울로 보여준다. 좌표는 원본에서 뽑는다. */
        transform: scaleX(-1);
      }
    </style>
  </head>
  <body>
    <video id="preview" autoplay playsinline muted></video>
    <script type="module">
      import {
        FilesetResolver,
        HandLandmarker,
        PoseLandmarker,
      } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/vision_bundle.mjs";

      const WASM_PATH =
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm";
      const POSE_MODEL =
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
      const HAND_MODEL =
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

      /**
       * 노리는 촬영 간격. 감지가 느린 기기에서는 이보다 벌어진다.
       * 서버는 이웃 프레임의 좌표 차이로 속도를 보므로, 실제로 벌어진
       * 간격은 함께 올려보낸 at을 가지고 RN이 보낼 때 바로잡는다.
       */
      const CAPTURE_INTERVAL_MS = 1000 / 30;

      /** 메시지가 지나치게 커지지 않도록 둔 상한. 5초 분량이다. */
      const MAX_FRAMES = 150;

      const POSE_LEFT_WRIST_INDEX = 15;
      const POSE_RIGHT_WRIST_INDEX = 16;

      /** 감지 전에 좌우를 반전할지. src/constants/holistic.ts가 정한다. */
      const MIRROR = ${String(MIRROR_BEFORE_DETECTION)};

      const video = document.getElementById("preview");
      // 반전할 때만 쓰는 작업용 캔버스. 화면에는 붙이지 않는다.
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      /**
       * 감지에 넣을 이미지.
       *
       * CSS transform은 픽셀을 건드리지 않아서 미리보기만 거울이 되고
       * 감지에는 영향이 없다. 그래서 반전해야 하면 캔버스에 뒤집어 그린다.
       */
      const toDetectionSource = () => {
        if (!MIRROR || !context) return video;

        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width === 0 || height === 0) return video;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        // x축을 뒤집고 폭만큼 밀어 좌우를 맞바꾼다.
        context.setTransform(-1, 0, 0, 1, width, 0);
        context.drawImage(video, 0, 0, width, height);
        context.setTransform(1, 0, 0, 1, 0, 0);

        return canvas;
      };

      let poseLandmarker = null;
      let handLandmarker = null;
      let isRecording = false;
      let sentFrames = 0;
      let lastCapturedAt = 0;
      let lastTimestamp = -1;

      const post = (message) => {
        window.ReactNativeWebView?.postMessage(JSON.stringify(message));
      };

      /** 좌표를 네 자리로 줄여 프레임마다 보내는 JSON을 작게 만든다. */
      const round = (value) => Math.round(value * 10000) / 10000;

      const toPoseLandmarks = (landmarks) =>
        landmarks.map((landmark) => ({
          x: round(landmark.x),
          y: round(landmark.y),
          z: round(landmark.z),
          // presence가 아니라 visibility를 보낸다.
          visibility: round(landmark.visibility ?? 0),
        }));

      const toHandLandmarks = (landmarks) =>
        landmarks.map((landmark) => ({
          x: round(landmark.x),
          y: round(landmark.y),
          z: round(landmark.z),
        }));

      const squaredDistance = (a, b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return dx * dx + dy * dy;
      };

      /**
       * 포즈 손목에 가까운 손을 그 손목의 손으로 본다.
       * handedness는 반전된 셀카를 전제하므로 쓰지 않는다.
       *
       * 두 손이 다 잡혔으면 한 손도 버리지 않는다.
       * 가슴 앞에서 손을 모으면 둘 다 한쪽 손목에 가까워지는데
       * 가까운 하나만 남기면 그 장만 한 손이 비어 동작이 끊겨 보인다.
       * 그래서 바로 놓기와 엇갈려 놓기 중 거리 합이 작은 쪽을 고른다.
       */
      const splitHandsByWrist = (hands, pose) => {
        const leftWrist = pose[POSE_LEFT_WRIST_INDEX];
        const rightWrist = pose[POSE_RIGHT_WRIST_INDEX];

        // 포즈를 못 잡았으면 좌우를 가를 기준이 없다.
        if (!leftWrist || !rightWrist) return { left: [], right: [] };

        // 손목이 안 잡힌 손은 어느 쪽인지 가릴 수 없다.
        const candidates = hands.filter((hand) => hand[0]).slice(0, 2);

        if (candidates.length === 0) return { left: [], right: [] };

        if (candidates.length === 1) {
          const [hand] = candidates;
          const toLeft = squaredDistance(hand[0], leftWrist);
          const toRight = squaredDistance(hand[0], rightWrist);

          return toLeft <= toRight
            ? { left: hand, right: [] }
            : { left: [], right: hand };
        }

        const [first, second] = candidates;
        const straight =
          squaredDistance(first[0], leftWrist) +
          squaredDistance(second[0], rightWrist);
        const crossed =
          squaredDistance(first[0], rightWrist) +
          squaredDistance(second[0], leftWrist);

        return straight <= crossed
          ? { left: first, right: second }
          : { left: second, right: first };
      };

      const loop = () => {
        requestAnimationFrame(loop);

        if (!isRecording || sentFrames >= MAX_FRAMES) return;
        if (video.readyState < 2) return;

        const now = performance.now();

        if (now - lastCapturedAt < CAPTURE_INTERVAL_MS) return;

        lastCapturedAt = now;

        // VIDEO 모드는 timestamp가 계속 커져야 한다.
        const timestamp = Math.max(now, lastTimestamp + 1);
        lastTimestamp = timestamp;

        // 포즈와 손은 같은 이미지에서 뽑아야 좌표가 어긋나지 않는다.
        const source = toDetectionSource();

        const pose = poseLandmarker?.detectForVideo(source, timestamp)
          ?.landmarks?.[0];

        // 포즈를 못 잡은 장은 보내도 0으로 채워질 뿐이라 건너뛴다.
        if (!pose || pose.length === 0) return;

        const hands =
          handLandmarker?.detectForVideo(source, timestamp)?.landmarks ?? [];
        const posePoints = toPoseLandmarks(pose);
        const split = splitHandsByWrist(hands.map(toHandLandmarks), posePoints);

        sentFrames += 1;

        post({
          type: "frame",
          // RN이 간격을 맞출 때 쓴다. RN과 기준시가 같아야 해서 Date.now를 쓴다.
          at: Date.now(),
          frame: { pose: posePoints, left: split.left, right: split.right },
        });
      };

      /** GPU를 못 쓰는 기기도 있어서 CPU로 한 번 더 시도한다. */
      const createLandmarker = async (Landmarker, vision, options) => {
        const build = (delegate) =>
          Landmarker.createFromOptions(vision, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate },
          });

        try {
          return await build("GPU");
        } catch {
          return await build("CPU");
        }
      };

      const openCamera = async () => {
        // getUserMedia는 보안 컨텍스트에서만 열린다.
        if (!navigator.mediaDevices?.getUserMedia) {
          post({ type: "error", reason: "insecure" });

          return false;
        }

        try {
          video.srcObject = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: false,
          });

          await video.play();

          return true;
        } catch (error) {
          post({ type: "error", reason: "camera", detail: String(error) });

          return false;
        }
      };

      const loadModels = async () => {
        try {
          const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

          poseLandmarker = await createLandmarker(PoseLandmarker, vision, {
            baseOptions: { modelAssetPath: POSE_MODEL },
            runningMode: "VIDEO",
            numPoses: 1,
          });
          handLandmarker = await createLandmarker(HandLandmarker, vision, {
            baseOptions: { modelAssetPath: HAND_MODEL },
            runningMode: "VIDEO",
            numHands: 2,
          });

          return true;
        } catch (error) {
          post({ type: "error", reason: "model", detail: String(error) });

          return false;
        }
      };

      window.__holistic = {
        setRecording(next) {
          isRecording = next;

          if (!next) return;

          sentFrames = 0;
          lastCapturedAt = 0;
        },
      };

      const setUp = async () => {
        if (!(await openCamera())) return;
        if (!(await loadModels())) return;

        post({ type: "ready" });
        requestAnimationFrame(loop);
      };

      void setUp();
    </script>
  </body>
</html>
`;
