import { colors } from "@/constants/colors";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

export const OFFLINE_MESSAGE = "네트워크 연결을 확인해주세요.";

interface QueryStateProps {
  isPending?: boolean;
  isPaused?: boolean;
  isError?: boolean;
  message?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export default function QueryState({
  isPending,
  isPaused,
  isError,
  message,
  isRetrying,
  onRetry,
}: QueryStateProps) {
  const isOffline = Boolean(isPaused && isPending);
  const text = isOffline ? OFFLINE_MESSAGE : message;

  if (!text) {
    return (
      <Placeholder>
        <ActivityIndicator color={colors.primary400} />
      </Placeholder>
    );
  }

  return (
    <Placeholder>
      <Message $isError={isError && !isOffline}>{text}</Message>

      {onRetry ? (
        <Retry
          onPress={onRetry}
          disabled={isRetrying}
          accessibilityRole="button"
          accessibilityLabel="다시 시도"
        >
          <RetryText>다시 시도</RetryText>
        </Retry>
      ) : null}
    </Placeholder>
  );
}

const Placeholder = styled.View`
  flex: 1;
  gap: 12px;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const Message = styled.Text<{ $isError?: boolean }>`
  font-size: 14px;
  text-align: center;
  color: ${({ $isError }) => ($isError ? colors.errorRed : colors.neutral600)};
`;

const Retry = styled.Pressable`
  padding: 8px 16px;
  border-radius: 999px;
  background-color: ${colors.primary100};
`;

const RetryText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary400};
`;
