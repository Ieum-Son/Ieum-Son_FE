import { colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import styled from "styled-components/native";

interface FavoritesWordProps {
  day: string;
  text: string;
  studyDate: string;
}

export default function FavoritesWord({
  day,
  text,
  studyDate,
}: FavoritesWordProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Wrapper>
      <Top>
        <Day>Day {day}</Day>
        <Star onPress={() => setIsFavorite((previous) => !previous)}>
          <MaterialIcons
            name={isFavorite ? "star" : "star-border"}
            size={24}
            color={colors.primary300}
          />
        </Star>
      </Top>
      <Text>{text}</Text>
      <StudyDate>최근 학습일 : {studyDate}</StudyDate>
    </Wrapper>
  );
}

const Wrapper = styled.View`
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

const Day = styled.Text`
  font-size: 12px;
  padding: 4px 12px;
  height: 26px;
  justify-content: center;
  align-items: center;
  width: 54px;
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

const StudyDate = styled.Text`
  font-size: 14px;
  color: ${colors.neutral600};
`;

const Top = styled.View`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
