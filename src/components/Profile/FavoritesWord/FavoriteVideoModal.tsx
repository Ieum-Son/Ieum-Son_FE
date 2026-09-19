import { colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { Modal, Pressable } from "react-native";
import styled from "styled-components/native";

interface FavoriteVideoModalProps {
  word: string;
  videoUrl: string;
  onClose: () => void;
}

export default function FavoriteVideoModal({
  word,
  videoUrl,
  onClose,
}: FavoriteVideoModalProps) {
  const player = useVideoPlayer(videoUrl, (loadedPlayer) => {
    loadedPlayer.loop = true;
    loadedPlayer.play();
  });

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Backdrop onPress={onClose}>
        <Sheet onStartShouldSetResponder={() => true}>
          <Header>
            <Word numberOfLines={1}>{word}</Word>
            <CloseButton
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="영상 닫기"
            >
              <MaterialIcons name="close" size={24} color={colors.neutral600} />
            </CloseButton>
          </Header>

          <VideoView
            player={player}
            style={{
              width: "100%",
              height: 220,
              borderRadius: 12,
              backgroundColor: colors.neutral1000,
            }}
            allowsFullscreen
            nativeControls
            contentFit="contain"
          />
        </Sheet>
      </Backdrop>
    </Modal>
  );
}

const Backdrop = styled(Pressable)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.45);
`;

const Sheet = styled.View`
  width: 100%;
  padding: 20px;
  gap: 16px;
  border-radius: 16px;
  background-color: ${colors.neutral0};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Word = styled.Text`
  flex: 1;
  color: ${colors.neutral1000};
  font-size: 20px;
  font-weight: 700;
`;

const CloseButton = styled.Pressable`
  align-items: center;
  justify-content: center;
`;
