import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import styled from "styled-components/native";

export default function Profile() {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUrl, setImageUrl] = useState("");

  const uploadImage = async () => {
    //권한 확인
    if (!status?.granted) {
      const permission = await requestPermission();

      if (!permission.granted) {
        return;
      }
    }

    //이미지 업로드
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    //이미지 업로드 한 거 표시
    setImageUrl(result.assets[0].uri);
  };

  return (
    <Wrapper onPress={uploadImage}>
      <UserProfile
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("@/assets/user/defaultProfile.png")
        }
      />
      {!imageUrl && (
        <Overlay pointerEvents="none">
          <Camera source={require("@/assets/user/camera.png")} />
        </Overlay>
      )}
    </Wrapper>
  );
}

const Overlay = styled.View`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.Pressable`
  width: 120px;
  height: 120px;
  position: relative;
`;

const UserProfile = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 100px;
`;

const Camera = styled(Image)`
  width: 48px;
  height: 48px;
`;
