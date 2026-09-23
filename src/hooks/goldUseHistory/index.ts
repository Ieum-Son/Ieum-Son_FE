import { getGoldUseHistory } from "@/apis/goldUseHistory";
import type {
  GetGoldUseHistoryProps,
  GetGoldUseHistoryResponse,
  GoldUseHistoryType,
} from "@/apis/goldUseHistory/type";
import { useQuery } from "@tanstack/react-query";
import { createErrorMessage } from "../errorResponse";

export const GOLD_USE_HISTORY_QUERY_KEY = ["goldUseHistory"];

export const getGoldUseHistoryErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "금조각 사용 내역을 불러오는 데 실패했습니다.",
});

/** EARN_로 시작하면 획득, 그 외(SPEND_, BUY_)는 사용이다. */
export const isEarnedGold = (type: GoldUseHistoryType) =>
  type.startsWith("EARN_");

export const useGoldUseHistory = (params: GetGoldUseHistoryProps = {}) =>
  useQuery<GetGoldUseHistoryResponse, Error>({
    queryKey: [...GOLD_USE_HISTORY_QUERY_KEY, params],
    queryFn: () => getGoldUseHistory(params),
  });
