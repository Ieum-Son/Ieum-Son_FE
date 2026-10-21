import StudyVideo from "../StudyVideo";

interface VideoSelectionBoxProps {
  videoUrl?: string;
  label?: string;
}

export default function VideoSelectionBox({
  videoUrl,
  label = "학습 영상",
}: VideoSelectionBoxProps) {
  return <StudyVideo videoUrl={videoUrl} accessibilityLabel={label} />;
}
