import { colors } from "@/constants/colors";
import type { ImageSource } from "expo-image";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import DayHeader from "../DayHeader";
import DescriptionBox from "../DescriptionBox";
import NextButton from "../NextButton";
import WordCategory from "../WordCategory";
import CameraSelectionBox from "./CameraSelectionBox";

interface CameraStudyLayoutProps {
  day: number;
  step: number;
  totalSteps: number;
  word: string;
  category?: string;
  guide: string;
  description: string;
  imageSource: ImageSource;
  recognitionRate?: number;
  attemptCount?: number;
  errorMessage?: string;
  isSubmitting?: boolean;
  onNext?: () => void;
}

export default function CameraStudyLayout({
  day,
  step,
  totalSteps,
  word,
  category,
  guide,
  description,
  imageSource,
  recognitionRate,
  attemptCount,
  errorMessage,
  isSubmitting,
  onNext,
}: CameraStudyLayoutProps) {
  const progress = totalSteps > 0 ? step / totalSteps : 0;
  const initialProgress = totalSteps > 0 ? (step - 1) / totalSteps : 0;

  return (
    <Screen edges={["top", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <DayHeader
            day={day}
            progress={progress}
            initialProgress={initialProgress}
            onBack={() => router.back()}
          />

          <LessonContent>
            <WordCategory category={category} />
            <Heading selectable>{word}</Heading>
            <Guide selectable>{guide}</Guide>
            <CameraSelectionBox
              source={imageSource}
              recognitionRate={recognitionRate}
            />
            <DescriptionBox description={description} />

            {attemptCount ? (
              <AttemptCount
                selectable
              >{`지금까지 ${attemptCount}번 시도했어요.`}</AttemptCount>
            ) : null}

            {errorMessage ? (
              <ErrorText accessibilityLiveRegion="polite">
                {errorMessage}
              </ErrorText>
            ) : null}
          </LessonContent>
        </Content>
      </ScrollView>

      <ButtonArea>
        <NextButton
          label={isSubmitting ? "저장 중" : "다음 학습으로 넘어가기"}
          accessibilityLabel={
            isSubmitting ? "학습 기록 저장 중" : "다음 학습으로 이동"
          }
          onPress={onNext}
          disabled={isSubmitting}
        />
      </ButtonArea>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.neutral0};
`;

const AttemptCount = styled.Text`
  margin-top: 12px;
  color: ${colors.neutral600};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
`;

const Content = styled.View`
  flex: 1;
  padding: 10px 20px 24px;
`;

const LessonContent = styled.View`
  padding-top: 32px;
  align-items: center;
`;

const Heading = styled.Text`
  color: ${colors.neutral1000};
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  line-height: 34px;
  letter-spacing: -0.2px;
`;

const Guide = styled.Text`
  padding-top: 6px;
  padding-bottom: 24px;
  color: ${colors.neutral700};
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  margin-top: -5px;
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
