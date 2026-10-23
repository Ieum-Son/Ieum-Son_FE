import DayHeader from "@/components/Study/DayHeader";
import NextButton from "@/components/Study/NextButton";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import HintBox from "./HintBox";
import VideoChoiceList, { type VideoChoiceItem } from "./VideoChoiceList";

export interface ChoiceAnswerResult {
  correct: boolean;
  completed: boolean;
  answerIndex: number;
  answerLabel: string;
}

const getResultMessage = ({
  correct,
  completed,
  answerLabel,
}: ChoiceAnswerResult) => {
  if (correct) return "정답이에요!";

  if (completed) {
    return `이미 완료한 문장이에요. 정답은 ${answerLabel}이에요.`;
  }

  return `아쉬워요. 정답은 ${answerLabel}이에요.`;
};

interface ChoiceStudyLayoutProps {
  day: number;
  step: number;
  totalSteps: number;
  sentence: string;
  highlightWord?: string;
  hint?: string;
  options: VideoChoiceItem[];
  selectedIndex: number | null;
  result: ChoiceAnswerResult | null;
  notice?: string;
  isSubmitting?: boolean;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}

const renderSentence = (sentence: string, highlightWord?: string) => {
  if (!highlightWord) return sentence;

  const startIndex = sentence.indexOf(highlightWord);

  if (startIndex === -1) return sentence;

  return (
    <>
      {sentence.slice(0, startIndex)}
      <Highlight>{highlightWord}</Highlight>
      {sentence.slice(startIndex + highlightWord.length)}
    </>
  );
};

export default function ChoiceStudyLayout({
  day,
  step,
  totalSteps,
  sentence,
  highlightWord,
  hint,
  options,
  selectedIndex,
  result,
  notice,
  isSubmitting,
  onSelect,
  onSubmit,
  onNext,
}: ChoiceStudyLayoutProps) {
  const progress = totalSteps > 0 ? step / totalSteps : 0;
  const initialProgress = totalSteps > 0 ? (step - 1) / totalSteps : 0;

  return (
    <Screen edges={["top", "bottom"]}>
      <FixedTop>
        <DayHeader
          day={day}
          progress={progress}
          initialProgress={initialProgress}
          onBack={() => router.back()}
        />

        <Question>
          <Title selectable>{renderSentence(sentence, highlightWord)}</Title>
          <Guide selectable>
            위 문장 중 파란 단어를 표현하는 영상을 골라주세요.
          </Guide>
        </Question>
      </FixedTop>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VideoChoiceList
          options={options}
          selectedIndex={selectedIndex}
          answerIndex={result ? result.answerIndex : null}
          locked={Boolean(result) || isSubmitting}
          onSelect={onSelect}
        />

        {result ? (
          <Feedback
            $positive={result.correct || result.completed}
            accessibilityLiveRegion="polite"
          >
            {getResultMessage(result)}
          </Feedback>
        ) : null}

        {!result && notice ? (
          <Feedback $positive={false} accessibilityLiveRegion="polite">
            {notice}
          </Feedback>
        ) : null}

        {hint ? (
          <HintArea>
            <HintBox>{hint}</HintBox>
          </HintArea>
        ) : null}
      </ScrollView>

      <ButtonArea>
        <NextButton
          label={result ? "다음" : "확인"}
          accessibilityLabel={result ? "다음 학습으로 이동" : "답안 제출"}
          showArrow={Boolean(result)}
          onPress={result ? onNext : onSubmit}
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

const FixedTop = styled.View`
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

const Highlight = styled.Text`
  color: ${colors.primary400};
`;

const Guide = styled.Text`
  margin-top: 2px;
  color: ${colors.neutral700};
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

const HintArea = styled.View`
  margin-top: 12px;
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
