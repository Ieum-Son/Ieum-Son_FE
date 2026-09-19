export interface FavoriteWord {
  wordId: number;
  word: string;
  videoUrl: string;
  category: string;
  recentLearnedDate: string;
}

export interface GetFavoriteResponse {
  items: FavoriteWord[];
}

export interface AddFavoriteProps {
  wordId: number;
}

export type DeleteFavoriteProps = AddFavoriteProps;
