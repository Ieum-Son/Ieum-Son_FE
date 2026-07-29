import { useLogout } from "@/hooks/auth/useLogout";
import React from "react";
import { Alert } from "react-native";
import ProfileOption from "./ProfileOption";

export default function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  const handlePress = () => {
    Alert.alert("로그아웃", "로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <ProfileOption
      content="로그아웃"
      destructive
      onPress={isPending ? undefined : handlePress}
    />
  );
}
