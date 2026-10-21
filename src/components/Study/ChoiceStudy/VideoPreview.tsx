import StudyVideo from "../StudyVideo";

interface VideoPreviewProps {
  label: string;
  videoUrl?: string;
}

export default function VideoPreview({ label, videoUrl }: VideoPreviewProps) {
  return (
    <StudyVideo
      videoUrl={videoUrl}
      accessibilityLabel={`${label} 영상 미리보기`}
      emptyMessage="영상 준비 중"
    />
  );
}
