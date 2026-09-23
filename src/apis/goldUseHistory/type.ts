export type GoldUseHistoryType =
  "EARN_LEARNING" | "EARN_STREAK_BONUS" | "SPEND_STREAK_RECOVERY" | "BUY_ITEM";

export interface GoldUseHistoryItem {
  id: number;
  /** 항상 양수. 획득인지 사용인지는 type으로 구분한다. */
  amount: number;
  type: GoldUseHistoryType;
  description: string;
  createdAt: string;
}

export interface GetGoldUseHistoryResponse {
  balance: number;
  /** 최신순 */
  items: GoldUseHistoryItem[];
}

export interface GetGoldUseHistoryProps {
  page?: number;
  size?: number;
}
