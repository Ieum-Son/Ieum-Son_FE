import { colors } from "@/constants/colors";
import { Image, type ImageSource } from "expo-image";
import styled from "styled-components/native";

interface ImageSelectionBoxProps {
  source?: ImageSource;
  accessibilityLabel?: string;
}

export default function ImageSelectionBox({
  source,
  accessibilityLabel = "학습 수형 이미지",
}: ImageSelectionBoxProps) {
  return (
    <Wrapper>
      {source ? (
        <StudyImage
          source={source}
          contentFit="contain"
          accessibilityLabel={accessibilityLabel}
        />
      ) : (
        <EmptyText selectable>수형 이미지 준비 중</EmptyText>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: 316px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${colors.neutral0};
`;

const StudyImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const EmptyText = styled.Text`
  color: ${colors.neutral500};
  font-size: 14px;
`;
