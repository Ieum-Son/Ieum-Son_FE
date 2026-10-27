import { colors } from "@/constants/colors";
import { useEffectiveVolume } from "@/stores/soundStore";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import styled from "styled-components/native";

interface StudyVideoProps {
  videoUrl?: string;
  accessibilityLabel: string;
  emptyMessage?: string;
}

export default function StudyVideo({
  videoUrl,
  accessibilityLabel,
  emptyMessage = "학습 영상 준비 중",
}: StudyVideoProps) {
  const volume = useEffectiveVolume();
  const player = useVideoPlayer(videoUrl ?? null, (loadedPlayer) => {
    loadedPlayer.loop = true;
    loadedPlayer.volume = volume;
  });

  useEffect(() => {
    player.volume = volume;
  }, [player, volume]);

  if (!videoUrl) {
    return (
      <Wrapper>
        <EmptyText selectable>{emptyMessage}</EmptyText>
      </Wrapper>
    );
  }

  return (
    <Wrapper accessible accessibilityLabel={accessibilityLabel}>
      <VideoView
        player={player}
        style={{ width: "100%", height: "100%" }}
        nativeControls
        contentFit="contain"
      />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: 258px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${colors.neutral800};
`;

const EmptyText = styled.Text`
  color: ${colors.neutral300};
  font-size: 14px;
  font-weight: 500;
`;
