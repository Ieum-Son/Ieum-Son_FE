export interface UserInfoResponse {
  name: string;
  email: string;
  loginId: string;
  profileImageUrl: string | null;
  gold: number;
  streakCount: number;
  longestStreakCount: number;
  monthStudyCount: number;
}
