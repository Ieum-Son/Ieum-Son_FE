import styled from "styled-components/native";
import ReviewAnswerOption from "./ReviewAnswerOption";

interface ReviewAnswerListProps {
  answers: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export default function ReviewAnswerList({
  answers,
  selectedIndex,
  onSelect,
}: ReviewAnswerListProps) {
  return (
    <Wrapper accessibilityRole="radiogroup">
      {answers.map((answer, index) => (
        <ReviewAnswerOption
          key={answer}
          label={answer}
          selected={selectedIndex === index}
          onPress={() => onSelect(index)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  gap: 12px;
  margin-top: 8px;
`;
