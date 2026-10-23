import styled from "styled-components/native";
import ReviewAnswerOption, {
  type ReviewAnswerState,
} from "./ReviewAnswerOption";

interface ReviewAnswerListProps {
  answers: string[];
  selectedIndex: number | null;
  answerIndex?: number | null;
  locked?: boolean;
  onSelect: (index: number) => void;
}

const getAnswerState = (
  index: number,
  selectedIndex: number | null,
  answerIndex?: number | null,
): ReviewAnswerState => {
  if (answerIndex === index) return "correct";
  if (selectedIndex !== index) return "default";

  return answerIndex === null || answerIndex === undefined
    ? "selected"
    : "wrong";
};

export default function ReviewAnswerList({
  answers,
  selectedIndex,
  answerIndex,
  locked,
  onSelect,
}: ReviewAnswerListProps) {
  return (
    <Wrapper accessibilityRole="radiogroup">
      {answers.map((answer, index) => (
        <ReviewAnswerOption
          key={answer}
          label={answer}
          state={getAnswerState(index, selectedIndex, answerIndex)}
          selected={selectedIndex === index}
          disabled={locked}
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
