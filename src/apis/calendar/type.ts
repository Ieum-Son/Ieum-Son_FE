export interface CalendarDay {
  date: string;
}

export interface GetCalendarResponse {
  year: number;
  month: number;
  days: CalendarDay[];
}

export interface GetCalendarProps {
  year?: number;
  month?: number;
}
