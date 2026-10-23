import styled from "styled-components/native";
import VideoChoiceOption, { type ChoiceOptionState } from "./VideoChoiceOption";
import VideoPreview from "./VideoPreview";

export interface VideoChoiceItem {
  label: string;
  videoUrl?: string;
}

interface VideoChoiceListProps {
  options: VideoChoiceItem[];
  selectedIndex: number | null;
  answerIndex?: number | null;
  locked?: boolean;
  onSelect: (index: number) => void;
}

const getOptionState = (
  index: number,
  selectedIndex: number | null,
  answerIndex?: number | null,
): ChoiceOptionState => {
  if (answerIndex === index) return "correct";
  if (selectedIndex !== index) return "default";

  return answerIndex === null || answerIndex === undefined
    ? "selected"
    : "wrong";
};

export default function VideoChoiceList({
  options,
  selectedIndex,
  answerIndex,
  locked,
  onSelect,
}: VideoChoiceListProps) {
  return (
    <Wrapper accessibilityRole="radiogroup">
      {options.map((option, index) => (
        <ChoiceItem key={option.label}>
          <VideoChoiceOption
            label={option.label}
            state={getOptionState(index, selectedIndex, answerIndex)}
            selected={selectedIndex === index}
            disabled={locked}
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
