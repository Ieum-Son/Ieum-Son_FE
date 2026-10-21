import ProfileHeader from "@/components/header/ProfileHeader";
import { colors } from "@/constants/colors";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

interface StudyStateScreenProps {
  title?: string;
  message?: string;
  isError?: boolean;
}

export default function StudyStateScreen({
  title = "오늘의 학습",
  message,
  isError,
}: StudyStateScreenProps) {
  return (
    <Screen edges={["top", "bottom"]}>
      <ProfileHeader title={title} />
      <Placeholder>
        {message ? (
          <Message $isError={isError}>{message}</Message>
        ) : (
          <ActivityIndicator color={colors.primary400} />
        )}
      </Placeholder>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.neutral0};
`;

const Placeholder = styled.View`
  flex: 1;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const Message = styled.Text<{ $isError?: boolean }>`
  font-size: 14px;
  text-align: center;
  color: ${({ $isError }) => ($isError ? colors.errorRed : colors.neutral600)};
`;
