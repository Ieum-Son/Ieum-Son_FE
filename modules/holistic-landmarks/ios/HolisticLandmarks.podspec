Pod::Spec.new do |s|
  s.name           = 'HolisticLandmarks'
  s.version        = '1.0.0'
  s.summary        = 'MediaPipe pose/hand landmarks as a VisionCamera frame processor'
  s.description    = '수어 채점에 보낼 MediaPipe Holistic 좌표를 프레임에서 추출한다.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'VisionCamera'
  # android/build.gradle, WebView의 @mediapipe/tasks-vision과 같은 버전으로 맞춘다.
  # 세 경로가 같은 모델을 같은 버전으로 돌려야 좌표가 어긋나지 않는다.
  s.dependency 'MediaPipeTasksVision', '0.10.35'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
  s.resource_bundles = {
    'HolisticLandmarksModels' => ['Models/*.task']
  }
end
