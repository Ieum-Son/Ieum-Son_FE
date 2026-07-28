import React from "react";
import styled from "styled-components/native";
import SettingBlock from "./SettingBlock";
import VolumeControl from "./VolumeControl";

interface SoundSettingControlProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function SoundSettingControl({
  value,
  onValueChange,
  volume,
  onVolumeChange,
}: SoundSettingControlProps) {
  return (
    <Wrapper>
      <SettingBlock
        icon="volume-high"
        text="음성 및 효과"
        option="toggle"
        value={value}
        onValueChange={onValueChange}
      />
      <VolumeControl
        value={volume}
        onValueChange={onVolumeChange}
        disabled={!value}
      />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: 68px;
`;
