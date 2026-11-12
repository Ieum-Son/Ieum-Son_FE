import { colors } from "@/constants/colors";
import styled from "styled-components/native";

export const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

export const TitleWrapper = styled.Text`
  margin: 30px 0px 30px 15px;
`;

export const LineText = styled.Text`
  color: ${colors.neutral800};
  font-size: 28px;
  font-weight: 700;
`;

export const ErrorText = styled.Text<{ spaced?: boolean }>`
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  ${({ spaced }) => spaced && "letter-spacing: 0.2px;"}
`;
