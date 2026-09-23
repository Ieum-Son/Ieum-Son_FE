import { colors } from "@/constants/colors";
import { getRecoverStreakErrorMessage, useRecoverStreak } from "@/hooks/streak";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";

interface StreakRecoveryProps {
  recoveryCost: number;
  goldBalance: number;
}

export default function StreakRecovery({
  recoveryCost,
  goldBalance,
}: StreakRecoveryProps) {
  const { mutate: recoverStreak, isPending } = useRecoverStreak();

  const canAfford = goldBalance >= recoveryCost;

  const handleRecover = () => {
    Alert.alert(
      "스트릭 회복",
      `금조각 ${recoveryCost}개를 사용해 연속 학습 기록을 되살릴까요?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "회복하기",
          onPress: () =>
            recoverStreak(undefined, {
              onSuccess: (data) =>
                Alert.alert(
                  "스트릭 회복 완료",
                  `금조각 ${data.spentGold}개를 사용해 ${data.streakCount}일 연속 기록을 되살렸어요.`,
                ),
              onError: (error) =>
                Alert.alert("회복 실패", getRecoverStreakErrorMessage(error)),
            }),
        },
      ],
    );
  };

  return (
    <Wrapper>
      <TextArea>
        <Title>연속 학습이 끊겼어요</Title>
        <Description>
          {canAfford
            ? `금조각 ${recoveryCost}개로 되살릴 수 있어요.`
            : `회복하려면 금조각 ${recoveryCost}개가 필요해요. (보유 ${goldBalance}개)`}
        </Description>
      </TextArea>

      <RecoverButton
        onPress={handleRecover}
        disabled={!canAfford || isPending}
        $enabled={canAfford && !isPending}
        accessibilityRole="button"
        accessibilityLabel={`금조각 ${recoveryCost}개로 스트릭 회복하기`}
      >
        {isPending ? (
          <ActivityIndicator color={colors.neutral0} size="small" />
        ) : (
          <>
            <CoinIcon
              name="circle-multiple"
              size={14}
              color={colors.neutral0}
            />
            <RecoverText>{recoveryCost}</RecoverText>
          </>
        )}
      </RecoverButton>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  padding-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top-width: 1px;
  border-top-color: ${colors.neutral100};
`;

const TextArea = styled.View`
  flex: 1;
  gap: 2px;
`;

const Title = styled.Text`
  color: ${colors.neutral800};
  font-size: 14px;
  font-weight: 600;
`;

const Description = styled.Text`
  color: ${colors.neutral500};
  font-size: 12px;
  line-height: 18px;
`;

const RecoverButton = styled.Pressable<{ $enabled: boolean }>`
  min-width: 72px;
  height: 34px;
  padding: 0 14px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 999px;
  background-color: ${({ $enabled }) =>
    $enabled ? colors.primary300 : colors.neutral300};
`;

const CoinIcon = styled(MaterialCommunityIcons)``;

const RecoverText = styled.Text`
  color: ${colors.neutral0};
  font-size: 14px;
  font-weight: 600;
`;
