import type { CalendarDay, CalendarPeriod } from "@/apis/calendar/type";
import type { StreakDay } from "@/apis/streak/type";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export type Weekday = (typeof WEEKDAYS)[number];

const parseDate = (value: string) => {
  const [year, month, day] = value.split(/[-./]/).map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

/** 끊긴 뒤 이 기간이 지나면 회복할 수 없다. */
export const RECOVERABLE_DAYS = 4;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  return start;
};

/**
 * 마지막 학습일로부터 회복할 수 있는 기간 안에 있는지.
 *
 * 서버의 recoverable은 "어제보다 전"이면 true라 기간 제한이 없다.
 * 너무 오래 끊긴 기록까지 되살리지 않도록 여기서 한 번 더 거른다.
 */
export const isWithinRecoveryPeriod = (week: StreakDay[] = []): boolean => {
  const lastLearnedAt = week
    .filter((day) => day.learned)
    .map((day) => parseDate(day.date))
    .filter((parsed): parsed is Date => parsed !== null)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  // 받아온 기간에 학습 기록이 없으면 회복할 대상도 없다.
  if (!lastLearnedAt) return false;

  const daysSince = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(lastLearnedAt).getTime()) /
      MS_PER_DAY,
  );

  return daysSince <= RECOVERABLE_DAYS;
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

export interface WeeklyLearningPoint {
  day: Weekday;
  value: number;
  isToday: boolean;
}

export const toWeeklyLearning = (
  week: StreakDay[] = [],
): WeeklyLearningPoint[] => {
  const thisWeekStart = startOfWeek(new Date());
  const todayIndex = new Date().getDay();
  const valueByWeekday = new Map<number, number>();

  week.forEach((day) => {
    const parsed = parseDate(day.date);

    if (!parsed) return;
    if (startOfWeek(parsed).getTime() !== thisWeekStart.getTime()) return;

    valueByWeekday.set(parsed.getDay(), day.wordsCompleted);
  });

  return WEEKDAYS.map((day, index) => ({
    day,
    value: valueByWeekday.get(index) ?? 0,
    isToday: index === todayIndex,
  }));
};

export const HEATMAP_WEEKS = 7;

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
const heatmapOrigin = ({ year, month }: CalendarPeriod) =>
  startOfWeek(new Date(year, month - 1, 1));

const weekColumn = (date: Date, origin: Date) =>
  Math.round((startOfWeek(date).getTime() - origin.getTime()) / MS_PER_WEEK);

/**
 * 서버가 그 달 전체를 보낼 때는 intensity로 학습 여부를 가리고,
 * 학습한 날짜만 보낼 때는 담겨 있는 것 자체를 학습으로 본다.
 */
const isLearnedDay = ({ intensity }: CalendarDay): boolean =>
  intensity === undefined || intensity > 0;

export const toHeatmapActivity = (
  days: CalendarDay[] = [],
  period: CalendarPeriod,
): boolean[][] => {
  const grid = Array.from({ length: WEEKDAYS.length }, () =>
    Array<boolean>(HEATMAP_WEEKS).fill(false),
  );
  const origin = heatmapOrigin(period);

  days.forEach((day) => {
    if (!isLearnedDay(day)) return;

    const parsed = parseDate(day.date);

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
