import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface Props {
  time: string;
}

export default function VerifyTimer({ time }: Props) {
  return <Timer>{time}</Timer>;
}

const Timer = styled.Text`
  color: ${colors.primary300};
  font-size: 14px;
  margin-right: 20px;
`;
