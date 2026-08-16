import RabbitImage from "@/assets/study_temp/temp2.png";
import { colors } from "@/constants/colors";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import NextButton from "../NextButton";
import CelebrationParticles from "./CelebrationParticles";
import CompletionStats from "./CompletionStats";

interface CompleteStudyLayoutProps {
  learnedWords: number;
  earnedGold: number;
  streakDays: number;
  userName: string;
  onComplete: () => void;
}

export default function CompleteStudyLayout({
  learnedWords,
  earnedGold,
  streakDays,
  userName,
  onComplete,
}: CompleteStudyLayoutProps) {
  return (
    <Screen edges={["top", "bottom"]}>
      <CelebrationParticles />

      <Content>
        <CompletionStats learnedWords={learnedWords} earnedGold={earnedGold} />

        <CopyGroup>
          <Title selectable>Day1 완료{"\n"}내일도 학습하러 와 주실 거죠?</Title>
          <Subtitle selectable>
            {`${userName}님은 ${streakDays}일 연속으로 학습 중이에요!`}
          </Subtitle>
        </CopyGroup>

        <Mascot
          source={RabbitImage}
          contentFit="contain"
          accessibilityLabel="오늘의 학습 완료를 축하하는 토끼 캐릭터"
        />
      </Content>

      <ButtonArea>
        <NextButton
          label="오늘의 학습 완료하기"
          showArrow={false}
          onPress={onComplete}
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
  align-items: center;
  padding: 40px 20px 0;
`;

const CopyGroup = styled.View`
  margin-top: 86px;
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

const Subtitle = styled.Text`
  margin-top: 12px;
  color: ${colors.neutral700};
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  text-align: center;
`;

const Mascot = styled(Image)`
  width: 245px;
  height: 346px;
  margin-top: 24px;
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
