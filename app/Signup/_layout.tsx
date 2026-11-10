import { SignupProvider } from "@/contexts/SignupContext";
import { Stack } from "expo-router";

export default function SignupLayout() {
  return (
    <SignupProvider>
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </SignupProvider>
  );
}
