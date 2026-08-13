import styled from "styled-components/native";
import VideoChoiceOption from "./VideoChoiceOption";

interface VideoChoiceListProps {
  options: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export default function VideoChoiceList({
  options,
  selectedIndex,
  onSelect,
}: VideoChoiceListProps) {
  return (
    <Wrapper accessibilityRole="radiogroup">
      {options.map((option, index) => (
        <VideoChoiceOption
          key={option}
          label={option}
          selected={selectedIndex === index}
          onPress={() => onSelect(index)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  gap: 12px;
`;
