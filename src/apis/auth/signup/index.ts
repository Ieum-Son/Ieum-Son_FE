import { api } from "@/apis";
import type {
  SignupProps,
  SignupResponse,
  VerifyCodeProps,
  VerifyEmailProps,
} from "./type";

export const verifyEmail = async ({
  email,
}: VerifyEmailProps): Promise<void> => {
  await api.post(`/api/auth/verify`, { email });
};

export const verifyCode = async ({
  email,
  code,
}: VerifyCodeProps): Promise<void> => {
  await api.post(`/api/auth/code`, { email, code });
};

export const signup = async ({
  email,
  name,
  loginId,
  password,
  image,
}: SignupProps): Promise<SignupResponse> => {
  const formData = new FormData();

  formData.append("email", email);
  formData.append("name", name);
  formData.append("loginId", loginId);
  formData.append("password", password);
  formData.append("image", {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as unknown as Blob);

  const response = await api.post<SignupResponse>(
    `/api/auth/signup`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
};
