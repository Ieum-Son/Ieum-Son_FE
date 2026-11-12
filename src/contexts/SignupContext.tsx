import type {
  ProfileImage,
  SignupFormProps,
  SignupProps,
} from "@/apis/auth/signup/type";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

interface SignupValues extends SignupFormProps {
  profile: ProfileImage | null;
  loginIdError: string | null;
}

interface SignupContextValue extends SignupValues {
  setEmail: (email: string) => void;
  setLoginId: (loginId: string) => void;
  setLoginIdError: (message: string | null) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;
  setProfile: (profile: ProfileImage | null) => void;
  getValues: () => SignupValues;
  getSignupPayload: () => SignupProps | null;
  reset: () => void;
}

const INITIAL_VALUES: SignupValues = {
  email: "",
  loginId: "",
  password: "",
  name: "",
  profile: null,
  loginIdError: null,
};

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: PropsWithChildren) {
  const [values, setValues] = useState<SignupValues>(INITIAL_VALUES);
  const valuesRef = useRef(values);

  valuesRef.current = values;

  const update = useCallback((patch: Partial<SignupValues>) => {
    setValues((previous) => ({ ...previous, ...patch }));
  }, []);

  const value = useMemo<SignupContextValue>(
    () => ({
      ...values,
      setEmail: (email) => update({ email }),
      setLoginId: (loginId) => update({ loginId, loginIdError: null }),
      setLoginIdError: (loginIdError) => update({ loginIdError }),
      setPassword: (password) => update({ password }),
      setName: (name) => update({ name }),
      setProfile: (profile) => update({ profile }),
      getValues: () => valuesRef.current,
      getSignupPayload: () => {
        const { email, loginId, password, name, profile } = valuesRef.current;

        if (!email || !loginId || !password || !name || !profile) return null;

        return { email, loginId, password, name, image: profile };
      },
      reset: () => setValues(INITIAL_VALUES),
    }),
    [values, update],
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
}

export const useSignupForm = () => {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error(
      "useSignupForm은 SignupProvider 안에서만 사용할 수 있습니다.",
    );
  }

  return context;
};
