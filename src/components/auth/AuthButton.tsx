import { colors } from "@/constants/colors";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

interface AuthButtonProps {
  isActive: boolean;
  text: string;
  onPress?: () => void;
  isLoading?: boolean;
  loadingText?: string;
}

export default function AuthButton({
  text,
  isActive,
  onPress,
  isLoading = false,
  loadingText = "전송중...",
}: AuthButtonProps) {
  const canPress = isActive && !isLoading;

  return (
    <Wrapper
      isActive={canPress}
      disabled={!canPress}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !canPress, busy: isLoading }}
    >
      {isLoading && (
        <Spinner
          color={colors.neutral0}
          size="small"
          accessibilityElementsHidden
        />
      )}
      <ButtonText>{isLoading ? loadingText : text}</ButtonText>
    </Wrapper>
  );
}

const Wrapper = styled.TouchableOpacity<{ isActive: boolean }>`
  height: 48px;
  width: 353px;
  max-width: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: ${({ isActive }) =>
    isActive ? colors.primary300 : colors.neutral400};
`;

const Spinner = styled(ActivityIndicator)``;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;
