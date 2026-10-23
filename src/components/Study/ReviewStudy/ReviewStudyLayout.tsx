import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import DayHeader from "../DayHeader";
import NextButton from "../NextButton";
import ReviewAnswerList from "./ReviewAnswerList";
import ReviewVideo from "./ReviewVideo";

interface ReviewStudyLayoutProps {
  day: number;
  step: number;
  totalSteps: number;
  title: string;
  guide: string;
  videoUrl?: string;
  answers: string[];
  answerDefinition?: string;
  selectedIndex: number | null;
  answerIndex: number | null;
  errorMessage?: string;
  isSubmitting?: boolean;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}

const getButtonText = (hasResult: boolean, isSubmitting?: boolean) => {
  if (hasResult) {
    return { label: "다음", accessibilityLabel: "다음 학습으로 이동" };
  }

  if (isSubmitting) {
    return { label: "제출 중", accessibilityLabel: "답안 제출 중" };
  }

  return { label: "확인", accessibilityLabel: "답안 제출" };
};

export default function ReviewStudyLayout({
  day,
  step,
  totalSteps,
  title,
  guide,
  videoUrl,
  answers,
  answerDefinition,
  selectedIndex,
  answerIndex,
  errorMessage,
  isSubmitting,
  onSelect,
  onSubmit,
  onNext,
}: ReviewStudyLayoutProps) {
  const progress = totalSteps > 0 ? step / totalSteps : 0;
  const initialProgress = totalSteps > 0 ? (step - 1) / totalSteps : 0;
  const hasResult = answerIndex !== null;
  const buttonText = getButtonText(hasResult, isSubmitting);

  return (
    <Screen edges={["top", "bottom"]}>
      <HeaderArea>
        <DayHeader
          day={day}
          progress={progress}
          initialProgress={initialProgress}
          onBack={() => router.back()}
        />
      </HeaderArea>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Question>
          <Title selectable>{title}</Title>
          <Guide selectable>{guide}</Guide>
        </Question>

        <ReviewVideo videoUrl={videoUrl} />

        <AnswerArea>
          <ReviewAnswerList
            answers={answers}
            selectedIndex={selectedIndex}
            answerIndex={answerIndex}
            locked={hasResult || isSubmitting}
            onSelect={onSelect}
          />
        </AnswerArea>

        {hasResult ? (
          <Feedback
            $positive={selectedIndex === answerIndex}
            accessibilityLiveRegion="polite"
          >
            {selectedIndex === answerIndex
              ? "정답이에요!"
              : `아쉬워요. 정답은 ${answers[answerIndex]}이에요.`}
          </Feedback>
        ) : null}

        {hasResult && answerDefinition ? (
          <Definition selectable>{answerDefinition}</Definition>
        ) : null}

        {!hasResult && errorMessage ? (
          <Feedback $positive={false} accessibilityLiveRegion="polite">
            {errorMessage}
          </Feedback>
        ) : null}
      </ScrollView>

      <ButtonArea>
        <NextButton
          label={buttonText.label}
          accessibilityLabel={buttonText.accessibilityLabel}
          showArrow={hasResult}
          onPress={hasResult ? onNext : onSubmit}
          disabled={selectedIndex === null || isSubmitting}
        />
      </ButtonArea>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.neutral0};
`;

const HeaderArea = styled.View`
  padding: 10px 20px 0;
`;

const Question = styled.View`
  padding-top: 32px;
  padding-bottom: 24px;
  align-items: center;
`;

const Title = styled.Text`
  color: ${colors.neutral1000};
  font-size: 24px;
  font-weight: 700;
  line-height: 34px;
  letter-spacing: -0.2px;
  text-align: center;
`;

const Guide = styled.Text`
  color: ${colors.neutral700};
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`;

const Definition = styled.Text`
  margin-top: 6px;
  color: ${colors.neutral600};
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`;

const Feedback = styled.Text<{ $positive: boolean }>`
  margin-top: 16px;
  color: ${({ $positive }) =>
    $positive ? colors.successGreen : colors.errorRed};
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  text-align: center;
`;

const AnswerArea = styled.View`
  padding-top: 24px;
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
