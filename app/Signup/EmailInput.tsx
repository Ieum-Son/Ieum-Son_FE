import { ModifyButton } from "@/components/auth/index";
import {
  CodeInput,
  ErrorText,
  Input,
  LineText,
  SignupFooter,
  SignupScreen,
  Wrapper,
} from "@/components/Signup/index";
import VerifyTimer from "@/components/Signup/VerifyTimer";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";
import styled from "styled-components/native";

export default function EmailInput() {
  const {
    email,
    changeEmail,
    code,
    changeCode,
    isCodeSent,
    errorMessage,
    isEmailErrorVisible,
    formattedTime,
    isModifyActive,
    isModifyDisabled,
    isSendingEmail,
    isNextActive,
    isVerifyingCode,
    requestCode,
    submitCode,
  } = useEmailVerification();

  return (
    <SignupScreen keyboardAvoidingStyle={{ flex: 1 }}>
      <TitleWrapper>
        <LineText>이메일을 입력해주세요</LineText>
      </TitleWrapper>

      <Wrapper>
        <InputWrapperWrapper>
          <EmailArea>
            <InputWrapper>
              <Input
                placeholder="이메일을 입력해주세요."
                value={email}
                onChangeText={changeEmail}
              />

              <ModifyButton
                isActive={isModifyActive}
                disabled={isModifyDisabled}
                onPress={requestCode}
                isLoading={isSendingEmail}
              />
            </InputWrapper>

            {isEmailErrorVisible && <ErrorText>{errorMessage}</ErrorText>}
          </EmailArea>

          {isCodeSent && (
            <CodeArea>
              <CodeRow>
                <CodeInputWrapper>
                  <CodeInput
                    placeholder="인증번호 6자리를 입력해주세요."
                    type="text"
                    value={code}
                    onChangeText={changeCode}
                  />
                </CodeInputWrapper>

                <VerifyTimer time={formattedTime} />
              </CodeRow>

              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </CodeArea>
          )}
        </InputWrapperWrapper>

        <SignupFooter
          text="다음"
          isActive={isNextActive}
          onPress={submitCode}
          isLoading={isVerifyingCode}
          loadingText="확인 중..."
        />
      </Wrapper>
    </SignupScreen>
  );
}

const TitleWrapper = styled.View`
  margin: 30px 0 30px 15px;
`;

const EmailArea = styled.View`
  gap: 4px;
`;

const CodeArea = styled.View`
  width: 353px;
  max-width: 100%;
  gap: 6px;
`;

const CodeRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const CodeInputWrapper = styled.View`
  flex: 1;
`;

const InputWrapperWrapper = styled.View`
  width: 100%;
  gap: 16px;
  align-items: center;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 93%;
`;
