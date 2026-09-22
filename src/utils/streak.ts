import type { CalendarDay } from "@/apis/calendar/type";
import type { StreakDay } from "@/apis/streak/type";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export type Weekday = (typeof WEEKDAYS)[number];

const parseDate = (value: string) => {
  const [year, month, day] = value.split(/[-./]/).map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const startOfWeek = (date: Date) => {
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());
  sunday.setHours(0, 0, 0, 0);

  return sunday;
};

export const toLearnedWeekdays = (week: StreakDay[] = []): Weekday[] => {
  const thisWeekStart = startOfWeek(new Date());

  return week.reduce<Weekday[]>((learnedDays, day) => {
    const parsed = parseDate(day.date);

    if (
      parsed &&
      day.learned &&
      startOfWeek(parsed).getTime() === thisWeekStart.getTime()
    ) {
      learnedDays.push(WEEKDAYS[parsed.getDay()]);
    }

    return learnedDays;
  }, []);
};

export const HEATMAP_WEEKS = 7;

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
export interface CalendarPeriod {
  year: number;
  month: number;
}

const heatmapOrigin = ({ year, month }: CalendarPeriod) =>
  startOfWeek(new Date(year, month - 1, 1));

const weekColumn = (date: Date, origin: Date) =>
  Math.round((startOfWeek(date).getTime() - origin.getTime()) / MS_PER_WEEK);

export const toHeatmapActivity = (
  days: CalendarDay[] = [],
  period: CalendarPeriod,
): boolean[][] => {
  const grid = Array.from({ length: WEEKDAYS.length }, () =>
    Array<boolean>(HEATMAP_WEEKS).fill(false),
  );
  const origin = heatmapOrigin(period);

  days.forEach(({ date }) => {
    const parsed = parseDate(date);

    if (!parsed) return;

    const column = weekColumn(parsed, origin);

    if (column < 0 || column >= HEATMAP_WEEKS) return;

    grid[parsed.getDay()][column] = true;
  });

  return grid;
};

export interface HeatmapCell {
  row: number;
  column: number;
}

export const toTodayCell = (period: CalendarPeriod): HeatmapCell | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const column = weekColumn(today, heatmapOrigin(period));

  if (column < 0 || column >= HEATMAP_WEEKS) return null;

  return { row: today.getDay(), column };
};
