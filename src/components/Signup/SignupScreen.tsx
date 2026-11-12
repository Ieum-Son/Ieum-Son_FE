import type { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import BackIcon from "./BackIcon";

interface SignupScreenProps extends PropsWithChildren {
  keyboardAvoidingStyle: StyleProp<ViewStyle>;
}

export default function SignupScreen({
  keyboardAvoidingStyle,
  children,
}: SignupScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={keyboardAvoidingStyle}
      >
        <Container>
          <BackIcon />

          {children}
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;
