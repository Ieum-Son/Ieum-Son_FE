export interface ChangeProfileResponse {
  profileImageUrl: string;
}

export interface ProfileImage {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface ChangeProfileProps {
  name?: string;
  img?: ProfileImage;
}
