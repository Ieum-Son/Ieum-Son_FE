export type GoldUseHistoryType =
  "EARN_LEARNING" | "EARN_STREAK_BONUS" | "SPEND_STREAK_RECOVERY" | "BUY_ITEM";

export interface GoldUseHistoryItem {
  id: number;
  amount: number;
  type: GoldUseHistoryType;
  description: string;
  createdAt: string;
}

export interface GetGoldUseHistoryResponse {
  balance: number;
  items: GoldUseHistoryItem[];
}

export interface GetGoldUseHistoryProps {
  page?: number;
  size?: number;
}
