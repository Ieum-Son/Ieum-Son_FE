import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface ModifyButtonProps {
  isActive: boolean;
  disabled: boolean;
  onPress: () => void;
}

interface ModifyWrapperProps {
  isActive: boolean;
}

export default function ModifyButton({
  isActive,
  disabled,
  onPress,
}: ModifyButtonProps) {
  return (
    <ModifyWrapper
      isActive={isActive}
      disabled={disabled || !isActive}
      onPress={onPress}
    >
      <Modify>{disabled ? "전송완료" : "인증"}</Modify>
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
