import { isAxiosError } from "axios";

export interface ErrorResponse {
  message: string;
}

export const UNKNOWN_ERROR_MESSAGE = "알 수 없는 오류가 발생했습니다.";
export const TOO_MANY_REQUESTS_MESSAGE =
  "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";

/**
 * 요청이 취소된 것인지. 로그인 전이라 인터셉터가 끊은 경우가 여기 해당한다.
 * 실패가 아니라 보내지 않은 것이므로 에러로 다루지 않는다.
 */
export const isCanceledRequest = (error: unknown) =>
  isAxiosError(error) && error.code === "ERR_CANCELED";

export const getErrorStatus = (error: unknown) =>
  isAxiosError<ErrorResponse>(error) ? error.response?.status : undefined;

export const getServerErrorMessage = (error: unknown) =>
  isAxiosError<ErrorResponse>(error)
    ? error.response?.data?.message
    : undefined;

interface ErrorMessageOptions {
  status?: Record<number, string>;
  fallback: string;
  preferServerMessage?: boolean | number[];
  unknownMessage?: string;
}

export const createErrorMessage = ({
  status: statusMessages,
  fallback,
  preferServerMessage = false,
  unknownMessage,
}: ErrorMessageOptions) => {
  return (error: unknown): string => {
    if (!isAxiosError<ErrorResponse>(error)) {
      if (unknownMessage) return unknownMessage;
      return error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE;
    }

    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    const usesServerMessage =
      preferServerMessage === true ||
      (Array.isArray(preferServerMessage) &&
        status !== undefined &&
        preferServerMessage.includes(status));

    if (usesServerMessage && serverMessage) return serverMessage;

    return (
      (status === undefined ? undefined : statusMessages?.[status]) ?? fallback
    );
  };
};
