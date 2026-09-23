export interface CalendarDay {
  date: string;
}

export interface GetCalendarResponse {
  year: number;
  month: number;
  days: CalendarDay[];
}

export interface CalendarPeriod {
  year: number;
  month: number;
}

export type GetCalendarProps = CalendarPeriod | { year?: never; month?: never };
