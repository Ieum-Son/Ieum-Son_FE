import { colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

interface FavoritesWordProps {
  category: string;
  word: string;
  recentLearnedDate: string;
  disabled?: boolean;
  onRemove: () => void;
  onPress: () => void;
}

const formatLearnedDate = (recentLearnedDate: string) => {
  if (!recentLearnedDate) return "-";

  return recentLearnedDate.slice(0, 10).replace(/-/g, ".");
};

export default function FavoritesWord({
  category,
  word,
  recentLearnedDate,
  disabled,
  onRemove,
  onPress,
}: FavoritesWordProps) {
  return (
    <Wrapper
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${word} 수어 영상 보기`}
    >
      <Top>
        <Category>{category}</Category>
        <Star
          onPress={onRemove}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`${word} 즐겨찾기 취소`}
        >
          <MaterialIcons name="star" size={24} color={colors.primary300} />
        </Star>
      </Top>
      <Text>{word}</Text>
      <LearnedDate>
        최근 학습일 : {formatLearnedDate(recentLearnedDate)}
      </LearnedDate>
    </Wrapper>
  );
}

const Wrapper = styled.Pressable`
  display: flex;
  height: 126px;
  padding: 16px 20px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 12px;
  background: ${colors.neutral50};
`;

const Category = styled.Text`
  font-size: 12px;
  padding: 4px 12px;
  height: 26px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.primary100};
  border-radius: 999px;
  color: ${colors.primary400};
  margin-bottom: 4px;
`;

const Star = styled.Pressable``;

const Text = styled.Text`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const LearnedDate = styled.Text`
  font-size: 14px;
  color: ${colors.neutral600};
`;

const Top = styled.View`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
