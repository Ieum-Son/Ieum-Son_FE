import styled from "styled-components/native";
import VideoChoiceOption from "./VideoChoiceOption";
import VideoPreview from "./VideoPreview";

export interface VideoChoiceItem {
  label: string;
  videoUrl?: string;
}

interface VideoChoiceListProps {
  options: VideoChoiceItem[];
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
        <ChoiceItem key={option.label}>
          <VideoChoiceOption
            label={option.label}
            selected={selectedIndex === index}
            onPress={() => onSelect(index)}
          />
          {selectedIndex === index && (
            <VideoPreview label={option.label} videoUrl={option.videoUrl} />
          )}
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
