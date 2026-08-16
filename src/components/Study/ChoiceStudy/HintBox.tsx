import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface HintBoxProps {
  children: string;
}

export default function HintBox({ children }: HintBoxProps) {
  return (
    <Wrapper>
      <Content selectable>{children}</Content>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  min-height: 96px;
  padding: 16px 20px;
  align-items: center;
  gap: 10px;
  justify-content: center;
  border-radius: 12px;
  background-color: ${colors.neutral50};
`;

const Content = styled.Text`
  color: ${colors.neutral700};
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  text-align: center;
`;
