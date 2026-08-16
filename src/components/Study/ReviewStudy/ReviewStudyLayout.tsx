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
  answers: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
}

export default function ReviewStudyLayout({
  day,
  step,
  totalSteps,
  answers,
  selectedIndex,
  onSelect,
  onNext,
}: ReviewStudyLayoutProps) {
  const progress = totalSteps > 0 ? step / totalSteps : 0;
  const initialProgress = totalSteps > 0 ? (step - 1) / totalSteps : 0;

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
          <Title selectable>2일 전 학습했어요</Title>
          <Guide selectable>
            아래 영상과 일치하는 뜻의 단어를 선택해주세요
          </Guide>
        </Question>

        <ReviewVideo />

        <AnswerArea>
          <ReviewAnswerList
            answers={answers}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
          />
        </AnswerArea>
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

const AnswerArea = styled.View`
  padding-top: 24px;
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
