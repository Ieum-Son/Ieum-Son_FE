export interface ChangeProfileResponse {
  profileImageUrl: string;
}

export interface ProfileImage {
  uri?: string | null;
  name?: string | null;
  type?: string | null;
}

export interface ChangeProfileProps {
  img?: ProfileImage | null;
}
