export interface VerifyEmailProps {
  email: string;
}

export interface VerifyCodeProps {
  email: string;
  code: string;
}

export interface SignupProps {
  email: string;
  name: string;
  loginId: string;
  password: string;
}
