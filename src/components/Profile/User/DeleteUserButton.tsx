import { colors } from "@/constants/colors";
import { useDeleteUser } from "@/hooks/auth/useDeleteUser";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import styled from "styled-components/native";
import ProfileOption from "./ProfileOption";

export default function DeleteUserButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const { mutate: withdraw, isPending } = useDeleteUser();

  const closeModal = () => {
    if (isPending) return;
    setIsModalVisible(false);
    setPassword("");
  };

  const openPasswordModal = () => {
    setPassword("");
    setIsModalVisible(true);
  };

  const handlePress = () => {
    Alert.alert("회원탈퇴", "정말 탈퇴하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        style: "destructive",
        onPress: openPasswordModal,
      },
    ]);
  };

  const handleDelete = () => {
    if (!password.trim()) {
      Alert.alert("비밀번호 확인", "비밀번호를 입력해주세요.");
      return;
    }

    withdraw(
      { password },
      {
        onSuccess: () => {
          setIsModalVisible(false);
          setPassword("");
        },
      },
    );
  };

  return (
    <>
      <ProfileOption
        content="회원탈퇴"
        destructive
        onPress={isPending ? undefined : handlePress}
      />

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <Backdrop onPress={closeModal}>
            <Dialog onStartShouldSetResponder={() => true}>
              <Title>회원탈퇴</Title>
              <Description>
                비밀번호를 입력해주세요.{"\n"}탈퇴 후에는 되돌릴 수 없습니다.
              </Description>
              <PasswordInput
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호"
                placeholderTextColor={colors.neutral500}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isPending}
                returnKeyType="done"
                onSubmitEditing={handleDelete}
              />
              <ButtonRow>
                <CancelButton onPress={closeModal} disabled={isPending}>
                  <CancelText>취소</CancelText>
                </CancelButton>
                <DeleteButton onPress={handleDelete} disabled={isPending}>
                  <DeleteText>{isPending ? "처리 중" : "탈퇴"}</DeleteText>
                </DeleteButton>
              </ButtonRow>
            </Dialog>
          </Backdrop>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const Backdrop = styled(Pressable)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.45);
`;

const Dialog = styled.View`
  width: 100%;
  padding: 24px 20px 20px;
  border-radius: 16px;
  background-color: ${colors.neutral0};
`;

const Title = styled.Text`
  color: ${colors.neutral1000};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`;

const Description = styled.Text`
  margin-top: 12px;
  color: ${colors.neutral700};
  font-size: 15px;
  line-height: 22px;
  text-align: center;
`;

const PasswordInput = styled.TextInput`
  height: 48px;
  margin-top: 20px;
  padding: 0 14px;
  border: 1px solid ${colors.neutral300};
  border-radius: 10px;
  color: ${colors.neutral1000};
  font-size: 16px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
`;

const DialogButton = styled.Pressable`
  flex: 1;
  height: 46px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const CancelButton = styled(DialogButton)`
  background-color: ${colors.neutral200};
`;

const DeleteButton = styled(DialogButton)`
  background-color: ${colors.errorRed};
`;

const CancelText = styled.Text`
  color: ${colors.neutral800};
  font-size: 16px;
  font-weight: 600;
`;

const DeleteText = styled.Text`
  color: ${colors.neutral0};
  font-size: 16px;
  font-weight: 600;
`;
