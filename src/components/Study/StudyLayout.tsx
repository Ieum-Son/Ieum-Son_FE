import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import DayHeader from "./DayHeader";
import DescriptionBox from "./DescriptionBox";
import NextButton from "./NextButton";
import SelectionBox from "./SelectionBox";

interface StudyLayoutProps {
  day: number;
  step: number;
  totalSteps: number;
  word: string;
  guide: string;
  description: string;
  onNext?: () => void;
}

export default function StudyLayout({
  day,
  step,
  totalSteps,
  word,
  guide,
  description,
  onNext,
}: StudyLayoutProps) {
  const progress = totalSteps > 0 ? step / totalSteps : 0;

  return (
    <Screen edges={["top", "bottom"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <DayHeader
            day={day}
            progress={progress}
            onBack={() => router.back()}
          />

          <LessonContent>
            <Heading selectable>
              {step}. {word}
            </Heading>
            <Guide selectable>{guide}</Guide>
            <SelectionBox />
            <DescriptionBox description={description} />
          </LessonContent>

          <ButtonArea>
            <NextButton onPress={onNext} disabled={!onNext} />
          </ButtonArea>
        </Content>
      </ScrollView>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.neutral0};
`;

const Content = styled.View`
  flex: 1;
  padding: 10px 20px 16px;
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
  line-height: 34px; /* 141.667% */
  letter-spacing: -0.2px;
`;

const Guide = styled.Text`
  padding-top: 6px;
  padding-bottom: 24px;
  color: ${colors.neutral700};
  font-size: 14px;
  text-align: center;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  margin-top: -5px;
`;

const ButtonArea = styled.View`
  flex: 1;
  min-height: 140px;
  padding-top: 28px;
  justify-content: flex-end;
`;
