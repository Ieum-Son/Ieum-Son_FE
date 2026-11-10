package expo.modules.holisticlandmarks

import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * 프레임 프로세서 플러그인을 VisionCamera 레지스트리에 올린다.
 * JS에서 VisionCameraProxy.initFrameProcessorPlugin("holisticLandmarks")로 찾는 이름이다.
 */
class HolisticLandmarksModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("HolisticLandmarks")

    OnCreate {
      // 개발 중 리로드로 OnCreate가 다시 불릴 수 있다.
      // 같은 이름을 두 번 등록하면 레지스트리가 assert로 죽는다.
      if (isRegistered) return@OnCreate

      val context = appContext.reactContext?.applicationContext ?: return@OnCreate

      FrameProcessorPluginRegistry.addFrameProcessorPlugin(PLUGIN_NAME) { _, _ ->
        HolisticLandmarksPlugin(context)
      }

      isRegistered = true
    }
  }

  private companion object {
    const val PLUGIN_NAME = "holisticLandmarks"
    var isRegistered = false
  }
}
