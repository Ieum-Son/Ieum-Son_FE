import { colors } from "@/constants/colors";
import { Pressable } from "react-native";
import styled from "styled-components/native";

interface VideoChoiceOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function VideoChoiceOption({
  label,
  selected,
  onPress,
}: VideoChoiceOptionProps) {
  return (
    <Option
      $selected={selected}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label} 선택`}
    >
      <OptionLabel $selected={selected}>{label}</OptionLabel>
      <Preview $selected={selected}>
        <PlayIcon $selected={selected}>▶</PlayIcon>
        <PreviewLabel $selected={selected}>영상보기</PreviewLabel>
      </Preview>
    </Option>
  );
}

const Option = styled(Pressable)<{ $selected: boolean }>`
  width: 100%;
  height: 48px;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  border: 1px solid
    ${({ $selected }) => ($selected ? colors.primary400 : colors.neutral400)};
  background-color: ${({ $selected }) =>
    $selected ? colors.primary100 : colors.neutral0};
`;

const OptionLabel = styled.Text<{ $selected: boolean }>`
  color: ${({ $selected }) =>
    $selected ? colors.primary600 : colors.neutral1000};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

const Preview = styled.View<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const PlayIcon = styled.Text<{ $selected: boolean }>`
  color: ${({ $selected }) =>
    $selected ? colors.primary500 : colors.neutral500};
  font-size: 14px;
`;

const PreviewLabel = styled.Text<{ $selected: boolean }>`
  color: ${({ $selected }) =>
    $selected ? colors.primary400 : colors.neutral600};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;
