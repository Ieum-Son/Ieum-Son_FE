import styled from "styled-components/native";
import VideoPreview from "./VideoPreview";
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
        <ChoiceItem key={option}>
          <VideoChoiceOption
            label={option}
            selected={selectedIndex === index}
            onPress={() => onSelect(index)}
          />
          {selectedIndex === index && <VideoPreview label={option} />}
        </ChoiceItem>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  gap: 12px;
`;

const ChoiceItem = styled.View`
  width: 100%;
  gap: 10px;
`;
