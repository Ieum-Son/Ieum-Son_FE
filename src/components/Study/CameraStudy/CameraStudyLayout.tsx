import { colors } from "@/constants/colors";
import type { ImageSource } from "expo-image";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import DayHeader from "../DayHeader";
import DescriptionBox from "../DescriptionBox";
import NextButton from "../NextButton";
import CameraSelectionBox from "./CameraSelectionBox";

interface CameraStudyLayoutProps {
  day: number;
  step: number;
  totalSteps: number;
  word: string;
  guide: string;
  description: string;
  imageSource: ImageSource;
  recognitionRate?: number;
  onNext?: () => void;
}

export default function CameraStudyLayout({
  day,
  step,
  totalSteps,
  word,
  guide,
  description,
  imageSource,
  recognitionRate,
  onNext,
}: CameraStudyLayoutProps) {
  const progress = totalSteps > 0 ? step / totalSteps : 0;

  return (
    <Screen edges={["top", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <DayHeader day={day} progress={progress} onBack={() => router.back()} />

          <LessonContent>
            <Heading selectable>
              {step}. {word}
            </Heading>
            <Guide selectable>{guide}</Guide>
            <CameraSelectionBox
              source={imageSource}
              recognitionRate={recognitionRate}
            />
            <DescriptionBox description={description} />
          </LessonContent>
        </Content>
      </ScrollView>

      <ButtonArea>
        <NextButton
          label="다음 학습으로 넘어가기"
          onPress={onNext}
          disabled={!onNext}
        />
      </ButtonArea>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.neutral0};
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
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
