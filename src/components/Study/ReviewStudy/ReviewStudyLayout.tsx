import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { type ImageSourcePropType, ScrollView } from "react-native";
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
  mediaSource: ImageSourcePropType;
  answers: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
}

export default function ReviewStudyLayout({
  day,
  step,
  totalSteps,
  title,
  guide,
  mediaSource,
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
          <Title selectable>{title}</Title>
          <Guide selectable>{guide}</Guide>
        </Question>

        <ReviewVideo source={mediaSource} word={answers[0]} />

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
