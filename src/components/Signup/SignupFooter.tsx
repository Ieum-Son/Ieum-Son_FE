import { AuthButton, Question } from "@/components/auth/index";
import { router } from "expo-router";
import { View } from "react-native";

interface SignupFooterProps {
  text: string;
  isActive: boolean;
  onPress: () => void;
  isLoading?: boolean;
  loadingText?: string;
}

export default function SignupFooter({
  text,
  isActive,
  onPress,
  isLoading,
  loadingText,
}: SignupFooterProps) {
  return (
    <View>
      <AuthButton
        text={text}
        isActive={isActive}
        onPress={onPress}
        isLoading={isLoading}
        loadingText={loadingText}
      />

      <Question
        question="계정이 있으신가요?"
        button="로그인"
        onPress={() => router.push("/Login")}
      />
    </View>
  );
}
