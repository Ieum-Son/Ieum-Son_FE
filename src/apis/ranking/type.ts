export interface RankingItem {
  rank: number;
  name: string;
  profileImageUrl: string | null;
  gold: number;
  isMe: boolean;
}

export interface RankingResponse {
  myRank: number;
  myGold: number;
  totalMembers: number;
  items: RankingItem[];
}
