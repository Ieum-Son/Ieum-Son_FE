import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface QuestionProps {
  question: string;
  button: string;
}

export default function Question({ question, button }: QuestionProps) {
  return (
    <Wrapper>
      <No>{question}</No>
      <Go>{button}</Go>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

const No = styled.Text`
  color: ${colors.neutral600};
`;

const Go = styled.Text`
  color: ${colors.primary300};
`;
