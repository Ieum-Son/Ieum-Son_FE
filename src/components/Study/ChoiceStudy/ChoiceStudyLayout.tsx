import DayHeader from "@/components/Study/DayHeader";
import NextButton from "@/components/Study/NextButton";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import HintBox from "./HintBox";
import VideoChoiceList, { type VideoChoiceItem } from "./VideoChoiceList";

interface ChoiceStudyLayoutProps {
  day: number;
  step: number;
  totalSteps: number;
  sentence: string;
  highlightWord?: string;
  hint?: string;
  options: VideoChoiceItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
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
  onSelect,
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
          onSelect={onSelect}
        />

        {hint ? (
          <HintArea>
            <HintBox>{hint}</HintBox>
          </HintArea>
        ) : null}
      </ScrollView>

      <ButtonArea>
        <NextButton onPress={onNext} disabled={selectedIndex === null} />
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

const HintArea = styled.View`
  margin-top: 12px;
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
