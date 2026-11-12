export interface CalendarDay {
  date: string;
  /**
   * 서버가 그 달의 모든 날짜를 보내면서 학습 여부를 이 값으로만 구분한다.
   * 학습한 날짜만 담아 주면 이 필드는 없어도 된다.
   */
  intensity?: number;
}

export interface GetCalendarResponse {
  year: number;
  month: number;
  /** 학습한 날짜만 오거나, 그 달 전체가 intensity와 함께 온다 */
  days: CalendarDay[];
}

export interface CalendarPeriod {
  year: number;
  month: number;
}

/** year, month는 둘 다 있거나 둘 다 없어야 한다. 한쪽만 보내면 서버가 무시한다. */
export type GetCalendarProps = CalendarPeriod | { year?: never; month?: never };
