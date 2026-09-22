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

export const toHeatmapActivity = (days: CalendarDay[] = []): boolean[][] => {
  const grid = Array.from({ length: WEEKDAYS.length }, () =>
    Array<boolean>(HEATMAP_WEEKS).fill(false),
  );

  const parsedDays = days
    .map((day) => ({ ...day, parsed: parseDate(day.date) }))
    .filter((day): day is CalendarDay & { parsed: Date } => day.parsed !== null)
    .sort((a, b) => a.parsed.getTime() - b.parsed.getTime());

  if (parsedDays.length === 0) return grid;

  const firstWeekStart = startOfWeek(parsedDays[0].parsed);

  parsedDays.forEach(({ parsed }) => {
    const column = Math.round(
      (startOfWeek(parsed).getTime() - firstWeekStart.getTime()) / MS_PER_WEEK,
    );

    if (column < 0 || column >= HEATMAP_WEEKS) return;

    grid[parsed.getDay()][column] = true;
  });

  return grid;
};

export interface HeatmapCell {
  row: number;
  column: number;
}

export const toTodayCell = (days: CalendarDay[] = []): HeatmapCell | null => {
  const firstDay = days
    .map((day) => parseDate(day.date))
    .filter((parsed): parsed is Date => parsed !== null)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  if (!firstDay) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const column = Math.round(
    (startOfWeek(today).getTime() - startOfWeek(firstDay).getTime()) /
      MS_PER_WEEK,
  );

  if (column < 0 || column >= HEATMAP_WEEKS) return null;

  return { row: today.getDay(), column };
};
