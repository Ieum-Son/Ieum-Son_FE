import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface NextButtonProps {
  onPress?: () => void;
  disabled?: boolean;
}

export default function NextButton({
  onPress,
  disabled = false,
}: NextButtonProps) {
  return (
    <Button
      accessibilityRole="button"
      accessibilityLabel="다음 학습으로 이동"
      disabled={disabled}
      $disabled={disabled}
      onPress={onPress}
    >
      <ButtonText>다음</ButtonText>
      <Arrow aria-hidden>›</Arrow>
    </Button>
  );
}

const Button = styled.Pressable<{ $disabled: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background-color: ${({ $disabled }) =>
    $disabled ? colors.neutral400 : colors.primary300};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
`;

const ButtonText = styled.Text`
  color: ${colors.neutral0};
  font-size: 16px;
  font-weight: 600;
`;

const Arrow = styled.Text`
  color: ${colors.neutral0};
  font-size: 26px;
  line-height: 26px;
  font-weight: 300;
`;
