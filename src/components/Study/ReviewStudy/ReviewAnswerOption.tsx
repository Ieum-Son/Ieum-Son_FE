import { colors } from "@/constants/colors";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export type ReviewAnswerState = "default" | "selected" | "correct" | "wrong";

interface ReviewAnswerOptionProps {
  label: string;
  state: ReviewAnswerState;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const borderColors: Record<ReviewAnswerState, string> = {
  default: colors.neutral400,
  selected: colors.primary400,
  correct: colors.successGreen,
  wrong: colors.errorRed,
};

const backgroundColors: Record<ReviewAnswerState, string> = {
  default: colors.neutral0,
  selected: colors.primary100,
  correct: colors.neutral0,
  wrong: colors.neutral0,
};

const labelColors: Record<ReviewAnswerState, string> = {
  default: colors.neutral1000,
  selected: colors.primary600,
  correct: colors.successGreen,
  wrong: colors.errorRed,
};

const stateLabels: Record<ReviewAnswerState, string> = {
  default: "",
  selected: ", 선택됨",
  correct: ", 정답",
  wrong: ", 오답",
};

export default function ReviewAnswerOption({
  label,
  state,
  selected,
  disabled,
  onPress,
}: ReviewAnswerOptionProps) {
  return (
    <Option
      $state={state}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      accessibilityLabel={`${label} 선택${stateLabels[state]}`}
      onPress={onPress}
    >
      <Label $state={state}>{label}</Label>
    </Option>
  );
}

const Option = styled(Pressable)<{ $state: ReviewAnswerState }>`
  width: 100%;
  height: 48px;
  align-items: center;
  padding: 12px 20px;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${({ $state }) => borderColors[$state]};
  border-radius: 12px;
  background-color: ${({ $state }) => backgroundColors[$state]};
`;

const Label = styled.Text<{ $state: ReviewAnswerState }>`
  color: ${({ $state }) => labelColors[$state]};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;
