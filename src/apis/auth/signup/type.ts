export interface VerifyEmailProps {
  email: string;
}

export interface VerifyCodeProps {
  email: string;
  code: string;
}

export interface SignupFormProps {
  email: string;
  name: string;
  loginId: string;
  password: string;
}

export interface ProfileImage {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface SignupProps extends SignupFormProps {
  image: ProfileImage;
}

export interface SignupResponse {
  profileImageUrl: string;
}
