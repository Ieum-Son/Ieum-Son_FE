import { colors } from "@/constants/colors";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

interface ModifyButtonProps {
  isActive: boolean;
  disabled: boolean;
  onPress: () => void;
  isLoading?: boolean;
}

interface ModifyWrapperProps {
  isActive: boolean;
}

export default function ModifyButton({
  isActive,
  disabled,
  onPress,
  isLoading = false,
}: ModifyButtonProps) {
  const canPress = isActive && !disabled && !isLoading;

  return (
    <ModifyWrapper
      isActive={isActive && !isLoading}
      disabled={!canPress}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !canPress, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.neutral0} size="small" />
      ) : (
        <Modify>{disabled ? "전송완료" : "인증"}</Modify>
      )}
    </ModifyWrapper>
  );
}

const ModifyWrapper = styled.TouchableOpacity<ModifyWrapperProps>`
  margin-left: 6px;
  justify-content: center;
  align-items: center;
  width: 82px;
  height: 48px;
  border-radius: 12px;
  background-color: ${({ isActive }) =>
    isActive ? colors.primary300 : colors.neutral400};
`;

const Modify = styled.Text`
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;
