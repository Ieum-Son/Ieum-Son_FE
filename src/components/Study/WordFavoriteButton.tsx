import { colors } from "@/constants/colors";
import {
  getAddFavoriteErrorMessage,
  getDeleteFavoriteErrorMessage,
  useAddFavorite,
  useDeleteFavorite,
} from "@/hooks/Favorite";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";

interface WordFavoriteButtonProps {
  wordId: number;
  word: string;
  isMastered: boolean;
  isFavorite: boolean;
}

export default function WordFavoriteButton({
  wordId,
  word,
  isMastered,
  isFavorite,
}: WordFavoriteButtonProps) {
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useDeleteFavorite();

  const isPending = isAdding || isRemoving;

  const handlePress = () => {
    if (!isMastered) {
      Alert.alert(
        "즐겨찾기",
        "학습을 완료한 단어만 즐겨찾기에 담을 수 있어요.",
      );
      return;
    }

    if (isFavorite) {
      removeFavorite(
        { wordId },
        {
          onError: (error) =>
            Alert.alert("삭제 실패", getDeleteFavoriteErrorMessage(error)),
        },
      );
      return;
    }

    addFavorite(
      { wordId },
      {
        onError: (error) =>
          Alert.alert("추가 실패", getAddFavoriteErrorMessage(error)),
      },
    );
  };

  return (
    <Button
      onPress={handlePress}
      disabled={isPending}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ checked: isFavorite, busy: isPending }}
      accessibilityLabel={`${word} 즐겨찾기 ${isFavorite ? "해제" : "추가"}`}
    >
      {isPending ? (
        <ActivityIndicator size="small" color={colors.primary300} />
      ) : (
        <MaterialIcons
          name={isFavorite ? "star" : "star-outline"}
          size={24}
          color={
            isFavorite
              ? colors.primary300
              : isMastered
                ? colors.neutral400
                : colors.neutral300
          }
        />
      )}
    </Button>
  );
}

const Button = styled.Pressable`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
`;
