import CameraImageSource from "@/assets/study_temp/camera.png";
import CameraStudyLayout from "@/components/Study/CameraStudy/CameraStudyLayout";
import { useState } from "react";

const TOTAL_STEPS = 5;

export default function StudyCamera() {
  const [step, setStep] = useState(1);

  return (
    <CameraStudyLayout
      day={1}
      step={step}
      totalSteps={TOTAL_STEPS}
      word="학습하다"
      guide={
        "화면 가운데에 얼굴을 맞추고, 학습한 수어를 따라해 보세요.\n동작이 완료되면 자동으로 인식됩니다."
      }
      description="오른 주먹의 1-2지를 펴서 바닥이 왼쪽으로 향하게 비스듬히 세워 위로 올리며 동시에 올린 왼쪽으로 잡는다."
      imageSource={CameraImageSource}
      recognitionRate={92}
      onNext={() =>
        setStep((currentStep) => Math.min(currentStep + 1, TOTAL_STEPS))
      }
    />
  );
}
