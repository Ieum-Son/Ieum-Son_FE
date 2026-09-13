import UserInfo from "@/apis/userInfo";
import { UserInfoResponse } from "@/apis/userInfo/type";
import { useUserStore } from "@/stores/userStore";
import { getAccessTokens } from "@/utils/tokenStorage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createErrorMessage } from "./errorResponse";

export const USER_INFO_QUERY_KEY = ["user"];

export const getUserInfoErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  fallback: "사용자 정보를 불러오는 데 실패했습니다.",
});

export type TokenStatus =
  "checking" | "authenticated" | "unauthenticated" | "error";

export const getTokenStatusMessage = (tokenStatus: TokenStatus) => {
  if (tokenStatus === "unauthenticated") {
    return "인증이 필요합니다. 다시 로그인해 주세요.";
  }
  if (tokenStatus === "error") {
    return "인증 정보를 확인할 수 없습니다. 다시 로그인해 주세요.";
  }
  return null;
};

export const useUserInfo = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("checking");

  useEffect(() => {
    let mounted = true;

    getAccessTokens()
      .then(
        (token) =>
          mounted &&
          setTokenStatus(token ? "authenticated" : "unauthenticated"),
      )
      .catch((error) => {
        console.error("액세스 토큰을 불러오지 못했습니다:", error);
        if (mounted) setTokenStatus("error");
      });

    return () => {
      mounted = false;
    };
  }, []);

  const user = useQuery<UserInfoResponse, Error>({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: UserInfo,
    enabled: tokenStatus === "authenticated",
  });

  useEffect(() => {
    if (tokenStatus !== "authenticated" || !user.data) return;

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
  }, [tokenStatus, user.data, setUser]);

  useEffect(() => {
    if (!user.error) return;

    console.error(getUserInfoErrorMessage(user.error));
  }, [user.error]);

  return { ...user, tokenStatus };
};
