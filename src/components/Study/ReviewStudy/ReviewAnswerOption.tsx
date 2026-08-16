import { colors } from "@/constants/colors";
import { Pressable } from "react-native";
import styled from "styled-components/native";

interface ReviewAnswerOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function ReviewAnswerOption({
  label,
  selected,
  onPress,
}: ReviewAnswerOptionProps) {
  return (
    <Option
      $selected={selected}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label} 선택`}
      onPress={onPress}
    >
      <Label $selected={selected}>{label}</Label>
    </Option>
  );
}

const Option = styled(Pressable)<{ $selected: boolean }>`
  width: 100%;
  height: 48px;
  align-items: center;
  padding: 12px 20px;
  justify-content: center;
  gap: 8px;
  border: 1px solid
    ${({ $selected }) => ($selected ? colors.primary400 : colors.neutral400)};
  border-radius: 12px;
  background-color: ${({ $selected }) =>
    $selected ? colors.primary100 : colors.neutral0};
`;

const Label = styled.Text<{ $selected: boolean }>`
  color: ${({ $selected }) =>
    $selected ? colors.primary600 : colors.neutral1000};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;
