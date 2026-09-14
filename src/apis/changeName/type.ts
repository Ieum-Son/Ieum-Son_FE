export interface ChangeNameResponse {
  name: string;
  email: string;
  loginId: string;
  profileImageUrl: string;
  gold: number;
  streakCount: number;
}

export interface ChangeNameProps {
  name: string;
}
