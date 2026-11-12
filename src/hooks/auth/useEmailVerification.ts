import { useSignupForm } from "@/contexts/SignupContext";
import { isValidEmail } from "@/utils/isValidEmail";
import { removeSpaces } from "@/utils/removeSpaces";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getServerErrorMessage } from "../errorResponse";
import { useTimer } from "../useTimer";
import { useVerifyCode, useVerifyEmail } from "./useSignup";

export const useEmailVerification = () => {
  const verifyEmailMutation = useVerifyEmail();
  const verifyCodeMutation = useVerifyCode();
  const { email, setEmail, getValues } = useSignupForm();

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const { formattedTime, isExpired, startTimer } = useTimer();
  const isModifyActive = isValidEmail(email) && !verifyEmailMutation.isPending;
  const isNextActive =
    isCodeSent &&
    /^\d{6}$/.test(code) &&
    !isExpired &&
    !verifyCodeMutation.isPending;

  useEffect(() => {
    setCode("");
    setIsCodeSent(false);
    setVerifiedEmail(null);
    setIsError(false);
    setErrorMessage("");
  }, [email]);

  const changeEmail = (text: string) => {
    setEmail(removeSpaces(text));
  };

  const changeCode = (text: string) => {
    setCode(text.replace(/\D/g, "").slice(0, 6));
    setErrorMessage("");
    setIsError(false);
  };

  const requestCode = async () => {
    if (!isValidEmail(email)) {
      setIsError(true);
      setErrorMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    const requestedEmail = email;

    try {
      await verifyEmailMutation.mutateAsync({ email: requestedEmail });

      if (getValues().email !== requestedEmail) {
        return;
      }

      setIsError(false);
      setErrorMessage("");
      setCode("");
      setIsCodeSent(true);
      setVerifiedEmail(requestedEmail);
      startTimer();
    } catch (error) {
      if (getValues().email !== requestedEmail) {
        return;
      }
      setIsError(true);
      setErrorMessage(
        getServerErrorMessage(error) ?? "인증 메일 전송에 실패했습니다.",
      );
    }
  };

  const submitCode = async () => {
    if (!verifiedEmail || verifiedEmail !== email) {
      setErrorMessage("현재 이메일로 다시 인증해주세요.");
      return;
    }

    if (isExpired) {
      setErrorMessage("인증 시간이 만료되었습니다. 다시 인증해주세요.");
      return;
    }

    try {
      const requestedEmail = verifiedEmail;
      await verifyCodeMutation.mutateAsync({ email: requestedEmail, code });

      if (getValues().email !== requestedEmail) {
        return;
      }
      setErrorMessage("");
      router.push("/Signup/IdSetting");
    } catch (error) {
      setErrorMessage(
        getServerErrorMessage(error) ??
          "인증 코드가 올바르지 않거나 만료되었습니다.",
      );
    }
  };

  return {
    email,
    changeEmail,
    code,
    changeCode,
    isCodeSent,
    errorMessage,
    // 이메일 칸 아래 에러는 코드 전송 전에만 보여준다
    isEmailErrorVisible: isError && !isCodeSent,
    formattedTime,
    isModifyActive,
    isModifyDisabled: isCodeSent && !isExpired,
    isSendingEmail: verifyEmailMutation.isPending,
    isNextActive,
    isVerifyingCode: verifyCodeMutation.isPending,
    requestCode,
    submitCode,
  };
};
