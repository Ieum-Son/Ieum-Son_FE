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
