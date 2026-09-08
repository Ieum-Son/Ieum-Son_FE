import type { ProfileImage } from "@/apis/auth/signup/type";
import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/auth/LoginInput";
import ProfileHeader from "@/components/header/ProfileHeader";
import { Profile } from "@/components/Signup";
import { colors } from "@/constants/colors";
import {
  getChangeProfileErrorMessage,
  useChangeProfile,
} from "@/hooks/ChangeProfile";
import {
  getTokenStatusMessage,
  getUserInfoErrorMessage,
  useUserInfo,
} from "@/hooks/UserInfo";
import { useUserStore, type UserProfile } from "@/stores/userStore";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function ChangeProfile() {
  const { error, tokenStatus } = useUserInfo();
  const user = useUserStore((state) => state.user);

  if (!user) {
    const message = error
      ? getUserInfoErrorMessage(error)
      : getTokenStatusMessage(tokenStatus);

    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <Container>
          <ProfileHeader
            title="프로필 변경"
            onBackPress={() => router.back()}
          />
          <Placeholder>
            {message ? (
              <ErrorText>{message}</ErrorText>
            ) : (
              <ActivityIndicator color={colors.primary400} />
            )}
          </Placeholder>
        </Container>
      </SafeAreaView>
    );
  }

  return <ChangeProfileForm user={user} />;
}

function ChangeProfileForm({ user }: { user: UserProfile }) {
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: changeProfile, isPending } = useChangeProfile();
  const [initialName] = useState(user.name);
  const [initialProfileImageUrl] = useState(user.profileImageUrl);
  const [name, setName] = useState(initialName);
  const [profile, setProfile] = useState<ProfileImage | null>(() =>
    initialProfileImageUrl
      ? {
          uri: initialProfileImageUrl,
          name: "current-profile",
          type: "image/jpeg",
        }
      : null,
  );
  const profileChanged = profile?.uri !== initialProfileImageUrl;
  const nameChanged = name !== initialName;
  const hasChanges = nameChanged || profileChanged;
  const isActive = hasChanges && name.length > 0 && !isPending;

  const handleChangeProfile = async () => {
    if (!isActive) return;
    setErrorMessage("");

    try {
      await changeProfile({
        ...(nameChanged ? { name } : {}),
        ...(profileChanged && profile?.uri ? { img: profile } : {}),
      });
    } catch (error) {
      setErrorMessage(getChangeProfileErrorMessage(error));
      return;
    }

    router.replace("/Profile/Profile");
  };

  const onChangeName = (text: string) => {
    setName(text.replace(/\s/g, ""));
    setErrorMessage("");
  };

  const handleBackPress = () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    Alert.alert(
      "변경사항이 저장되지 않았습니다",
      "저장하지 않고 이전 화면으로 이동하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "나가기",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flexGrow: 1 }}
      >
        <Container>
          <ProfileHeader title="프로필 변경" onBackPress={handleBackPress} />

          <TitleWrapper>
            <LineText>
              내 <Name>프로필</Name>을 최신 정보로 {"\n"}
              수정해보세요
            </LineText>{" "}
          </TitleWrapper>

          <Wrapper>
            <Center>
              <Profile value={profile} onChange={setProfile} />

              <InputWrapper>
                <Input
                  placeholder="새로운 이름을 입력해주세요"
                  type="text"
                  onChangeText={onChangeName}
                  value={name}
                />
                <SubText>
                  설정한 이름은 추후에도 자유롭게 변경할 수 있습니다.
                </SubText>
                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              </InputWrapper>
            </Center>

            <AuthButton
              text="확인"
              isActive={isActive}
              onPress={handleChangeProfile}
            />
          </Wrapper>
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Placeholder = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Center = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const SubText = styled.Text`
  color: ${colors.neutral500};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.2px;
`;

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const Wrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const InputWrapper = styled.View``;

const TitleWrapper = styled.Text`
  margin: 30px 0px 30px 15px;
`;

const Name = styled.Text`
  color: ${colors.primary400};
  font-size: 28px;
  font-weight: 700;
`;

const LineText = styled.Text`
  color: ${colors.neutral800};
  font-size: 28px;
  font-weight: 700;
`;
