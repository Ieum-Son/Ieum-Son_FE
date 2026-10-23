import { colors } from "@/constants/colors";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export type ChoiceOptionState = "default" | "selected" | "correct" | "wrong";

interface VideoChoiceOptionProps {
  label: string;
  state: ChoiceOptionState;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const borderColors: Record<ChoiceOptionState, string> = {
  default: colors.neutral400,
  selected: colors.primary400,
  correct: colors.successGreen,
  wrong: colors.errorRed,
};

const backgroundColors: Record<ChoiceOptionState, string> = {
  default: colors.neutral0,
  selected: colors.primary100,
  correct: colors.neutral0,
  wrong: colors.neutral0,
};

const labelColors: Record<ChoiceOptionState, string> = {
  default: colors.neutral1000,
  selected: colors.primary600,
  correct: colors.successGreen,
  wrong: colors.errorRed,
};

const previewIconColors: Record<ChoiceOptionState, string> = {
  default: colors.neutral500,
  selected: colors.primary500,
  correct: colors.successGreen,
  wrong: colors.errorRed,
};

const previewLabelColors: Record<ChoiceOptionState, string> = {
  default: colors.neutral600,
  selected: colors.primary400,
  correct: colors.successGreen,
  wrong: colors.errorRed,
};

const stateLabels: Record<ChoiceOptionState, string> = {
  default: "",
  selected: ", 선택됨",
  correct: ", 정답",
  wrong: ", 오답",
};

export default function VideoChoiceOption({
  label,
  state,
  selected,
  disabled,
  onPress,
}: VideoChoiceOptionProps) {
  return (
    <Option
      $state={state}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      accessibilityLabel={`${label} 선택${stateLabels[state]}`}
    >
      <OptionLabel $state={state}>{label}</OptionLabel>
      <Preview>
        <PlayIcon $state={state}>▶</PlayIcon>
        <PreviewLabel $state={state}>영상보기</PreviewLabel>
      </Preview>
    </Option>
  );
}

const Option = styled(Pressable)<{ $state: ChoiceOptionState }>`
  width: 100%;
  height: 48px;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  border: 1px solid ${({ $state }) => borderColors[$state]};
  background-color: ${({ $state }) => backgroundColors[$state]};
`;

const OptionLabel = styled.Text<{ $state: ChoiceOptionState }>`
  color: ${({ $state }) => labelColors[$state]};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

const Preview = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const PlayIcon = styled.Text<{ $state: ChoiceOptionState }>`
  color: ${({ $state }) => previewIconColors[$state]};
  font-size: 14px;
`;

const PreviewLabel = styled.Text<{ $state: ChoiceOptionState }>`
  color: ${({ $state }) => previewLabelColors[$state]};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;
