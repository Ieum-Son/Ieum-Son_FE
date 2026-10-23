import { colors } from "@/constants/colors";
import styled from "styled-components/native";

interface WordCategoryProps {
  category?: string;
}

export default function WordCategory({ category }: WordCategoryProps) {
  if (!category) return null;

  return <Chip selectable>{category}</Chip>;
}

const Chip = styled.Text`
  align-self: center;
  margin-bottom: 8px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: ${colors.primary400};
  background-color: ${colors.primary100};
  border-radius: 999px;
`;
