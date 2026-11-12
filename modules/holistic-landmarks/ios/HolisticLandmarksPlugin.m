#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("HolisticLandmarks/HolisticLandmarks-Swift.h")
#import "HolisticLandmarks/HolisticLandmarks-Swift.h"
#else
#import "HolisticLandmarks-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(HolisticLandmarksPlugin, holisticLandmarks)
