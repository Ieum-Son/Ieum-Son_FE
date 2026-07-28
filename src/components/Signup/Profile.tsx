import { useSignupStore } from "@/stores/signupStore";
import type { ProfileImage } from "@/apis/auth/signup/type";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import styled from "styled-components/native";

const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};
const SUPPORTED_IMAGE_MIME_TYPES = new Set(
  Object.values(MIME_TYPE_BY_EXTENSION),
);

const getImageMimeType = (
  mimeType: string | null | undefined,
  fileName: string | null | undefined,
  uri: string,
) => {
  const normalizedMimeType = mimeType?.toLowerCase();
  if (
    normalizedMimeType &&
    SUPPORTED_IMAGE_MIME_TYPES.has(normalizedMimeType)
  ) {
    return normalizedMimeType;
  }

  for (const source of [fileName, uri]) {
    const extension = source
      ?.split(/[?#]/)[0]
      .match(/\.([^.\/]+)$/)?.[1]
      ?.toLowerCase();

    if (extension && MIME_TYPE_BY_EXTENSION[extension]) {
      return MIME_TYPE_BY_EXTENSION[extension];
    }
  }

  return undefined;
};

interface ProfileProps {
  value?: ProfileImage | null;
  onChange?: (profile: ProfileImage) => void;
}

export default function Profile({ value, onChange }: ProfileProps) {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const signupProfile = useSignupStore((state) => state.profile);
  const setSignupProfile = useSignupStore((state) => state.setProfile);
  const profile = value === undefined ? signupProfile : value;

  const uploadImage = async () => {
    //권한 확인
    if (!status?.granted) {
      const permission = await requestPermission();

      if (!permission.granted) {
        Alert.alert("권한 필요", "사진 접근 권한을 허용해주세요.");
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
    const image = result.assets[0];
    const mimeType = getImageMimeType(
      image.mimeType,
      image.fileName,
      image.uri,
    );

    if (!mimeType) {
      Alert.alert(
        "지원하지 않는 이미지",
        "JPEG, PNG, WEBP, GIF 이미지만 선택할 수 있습니다.",
      );
      return;
    }

    const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1];

    const nextProfile = {
      uri: image.uri,
      name: image.fileName ?? `profile-${Date.now()}.${extension}`,
      type: mimeType,
      size: image.fileSize,
    };

    if (onChange) {
      onChange(nextProfile);
      return;
    }

    setSignupProfile(nextProfile);
  };

  return (
    <Wrapper onPress={uploadImage}>
      <UserProfile
        source={
          profile
            ? { uri: profile.uri }
            : require("@/assets/user/defaultProfile.png")
        }
      />
      {!profile && (
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
