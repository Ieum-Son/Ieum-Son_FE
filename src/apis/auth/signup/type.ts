export interface verifyEmailProps {
  email: string;
}

export interface verifyCodeProps {
  email: string;
  code: number;
}

export interface signupProps {
  email: string;
  name: string;
  loginId: string;
  password: string;
}
