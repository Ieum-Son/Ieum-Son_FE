import { colors } from "@/constants/colors";
import RabbitImage from "@/assets/study_temp/temp.png";
import { Image } from "expo-image";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import NextButton from "../NextButton";

interface ReviewIntroStudyLayoutProps {
  onReview: () => void;
}

export default function ReviewIntroStudyLayout({
  onReview,
}: ReviewIntroStudyLayoutProps) {
  return (
    <Screen edges={["top", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <CopyGroup>
            <Title selectable>
              거의 다 왔어요!{"\n"}오늘의 학습이 거의 끝나가요.
            </Title>
            <Subtitle selectable>
              마지막으로, 복습을 하러 갈까요?
            </Subtitle>
          </CopyGroup>

          <MascotArea>
            <Mascot
              source={RabbitImage}
              contentFit="contain"
              accessibilityLabel="복습을 안내하는 토끼 캐릭터"
            />
          </MascotArea>
        </Content>
      </ScrollView>

      <ButtonArea>
        <NextButton label="복습으로 넘어가기" onPress={onReview} />
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
  justify-content: center;
  padding: 64px 20px 24px;
`;

const CopyGroup = styled.View`
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

const MascotArea = styled.View`
  height: 300px;
  margin-top: 40px;
  align-items: center;
  justify-content: center;
`;

const Mascot = styled(Image)`
  width: 245px;
  height: 335px;
`;

const ButtonArea = styled.View`
  padding: 12px 20px 16px;
  background-color: ${colors.neutral0};
`;
