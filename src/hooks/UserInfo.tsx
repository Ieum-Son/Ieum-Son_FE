import UserInfo from "@/apis/userInfo";
import { UserInfoResponse } from "@/apis/userInfo/type";
import { useUserStore } from "@/stores/userStore";
import { getAccessTokens } from "@/utils/tokenStorage";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { ErrorResponse } from "./errorResponse";

export const USER_INFO_QUERY_KEY = ["user"];

export const getUserInfoErrorMessage = (error: unknown) => {
  if (!isAxiosError<ErrorResponse>(error)) {
    return error instanceof Error
      ? error.message
      : "알 수 없는 오류가 발생했습니다.";
  }
  const status = error.response?.status;

  if (status === 401) return "인증이 필요합니다.";
  if (status === 404) return "해당 유저가 존재하지 않습니다.";
  return "사용자 정보를 불러오는 데 실패했습니다.";
};

export const useUserInfo = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [hasAccessToken, setHasAccessToken] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    getAccessTokens()
      .then((token) => mounted && setHasAccessToken(!!token))
      .catch(() => mounted && setHasAccessToken(false));

    return () => {
      mounted = false;
    };
  }, []);

  const user = useQuery<UserInfoResponse, Error>({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: UserInfo,
    enabled: hasAccessToken === true,
  });

  useEffect(() => {
    if (!user.data) return;

    const next = {
      name: user.data.name,
      gold: user.data.gold,
      profileImageUrl: user.data.profileImageUrl ?? null,
    };
    const current = useUserStore.getState().user;

    if (
      current?.name === next.name &&
      current?.gold === next.gold &&
      current?.profileImageUrl === next.profileImageUrl
    ) {
      return;
    }

    setUser(next);
  }, [user.data, setUser]);

  useEffect(() => {
    if (!user.error) return;

    console.error(getUserInfoErrorMessage(user.error));
  }, [user.error]);

  return user;
};
