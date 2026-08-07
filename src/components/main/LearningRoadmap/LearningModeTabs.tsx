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
      {MODES.map((mode, index) => {
        const isActive = mode.key === activeMode;
        const layer = isActive
          ? 3
          : activeMode === "roadmap" && mode.key === "schedule"
            ? 2
            : 1;

        return (
          <ModeButton
            key={mode.key}
            $active={isActive}
            $isFirst={index === 0}
            $layer={layer}
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
  width: 235px;
  height: 32px;
  flex-direction: row;
  align-items: flex-start;
  align-self: center;
  overflow: visible;
  z-index: 2;
  transform: translateX(-35px);
`;

const ModeButton = styled.Pressable<{
  $active: boolean;
  $isFirst: boolean;
  $layer: number;
}>`
  position: relative;
  margin-left: ${({ $isFirst }) => ($isFirst ? "0" : "-12px")};
  z-index: ${({ $layer }) => $layer};
  width: ${({ $active }) => ($active ? "auto" : "72px")};
  height: 32.979px;
  padding: ${({ $active }) => ($active ? "0 24px" : "0")};
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 12px 12px 0 0;
  border-top-width: 1px;
  border-right-width: 1px;
  border-left-width: 1px;
  border-top-color: ${({ $active }) =>
    $active ? colors.neutral100 : "rgba(110, 186, 229, 0.5)"};
  border-right-color: ${({ $active }) =>
    $active ? colors.neutral100 : "rgba(110, 186, 229, 0.5)"};
  border-left-color: ${({ $active }) =>
    $active ? colors.neutral100 : "rgba(110, 186, 229, 0.5)"};
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
