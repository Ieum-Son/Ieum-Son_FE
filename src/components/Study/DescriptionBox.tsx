import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface DescriptionBoxProps {
  description: string;
}

export default function DescriptionBox({ description }: DescriptionBoxProps) {
  return (
    <Wrapper>
      <Description selectable>{description}</Description>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  margin-top: 12px;
  width: 100%;
  min-height: 96px;
  padding: 16px 20px;
  gap: 10px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.neutral50};
`;

const Description = styled.Text`
  color: ${colors.neutral700};
  font-weight: 400;
  text-align: center;
  font-size: 16px;
  line-height: 26px;
`;
