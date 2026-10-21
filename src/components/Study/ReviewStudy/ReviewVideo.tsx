import StudyVideo from "../StudyVideo";

interface ReviewVideoProps {
  videoUrl?: string;
}

export default function ReviewVideo({ videoUrl }: ReviewVideoProps) {
  return (
    <StudyVideo
      videoUrl={videoUrl}
      accessibilityLabel="복습 문제 수어 영상"
      emptyMessage="복습 영상 준비 중"
    />
  );
}
