export interface LoginRequestProps {
  loginId: string;
  password: string;
}

export interface LoginResponseProps {
  accessToken: string;
  refreshToken: string;
}
