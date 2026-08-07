import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { default as styled } from "styled-components/native";

export type LearningMode = "roadmap" | "schedule" | "progress";

interface LearningModeTabsProps {
  activeMode: LearningMode;
  onChange: (mode: LearningMode) => void;
}

const MODES = [
  { key: "roadmap", label: "로드맵", icon: "map-outline" },
  { key: "schedule", label: "오늘의 학습", icon: "calendar-outline" },
  { key: "progress", label: "주 학습", icon: "bar-chart-outline" },
] as const;

export default function LearningModeTabs({
  activeMode,
  onChange,
}: LearningModeTabsProps) {
  const [labelWidths, setLabelWidths] = React.useState<
    Partial<Record<LearningMode, number>>
  >({});
  const activeModeItem = MODES.find((mode) => mode.key === activeMode)!;
  const activeButtonWidth =
    (labelWidths[activeMode] ?? activeModeItem.label.length * 16) +
    17 +
    2 +
    24 * 2;

  return (
    <Wrapper accessibilityRole="tablist">
      {MODES.map((mode) => {
        const isActive = mode.key === activeMode;

        return (
          <ModeButton
            key={mode.key}
            $active={isActive}
            style={isActive ? { width: activeButtonWidth } : undefined}
            onPress={() => onChange(mode.key)}
            accessibilityRole="tab"
            accessibilityLabel={mode.label}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={mode.icon}
              size={17}
              color={isActive ? colors.primary400 : colors.neutral0}
            />
            {isActive && (
              <ModeLabel
                numberOfLines={1}
                onLayout={(event) => {
                  const labelWidth = event.nativeEvent.layout.width;

                  setLabelWidths((currentWidths) =>
                    currentWidths[mode.key] === labelWidth
                      ? currentWidths
                      : { ...currentWidths, [mode.key]: labelWidth },
                  );
                }}
              >
                {mode.label}
              </ModeLabel>
            )}
          </ModeButton>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  height: 32px;
  flex-direction: row;
  align-items: flex-end;
  align-self: center;
  overflow: visible;
`;

const ModeButton = styled.Pressable<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "auto" : "72px")};
  height: ${({ $active }) => ($active ? "40px" : "32px")};
  padding: ${({ $active }) => ($active ? "0 24px" : "0")};
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 12px 12px 0 0;
  border-top: 1px solid ${colors.neutral100};
  border-right: 1px solid ${colors.neutral100};
  border-left: 1px solid ${colors.neutral100};
  background-color: ${({ $active }) =>
    $active ? colors.neutral50 : colors.primary200};
  flex-direction: row;
`;

const ModeLabel = styled.Text`
  flex-shrink: 0;
  color: ${colors.primary400};
  font-size: 16px;
  font-weight: 600;
`;
