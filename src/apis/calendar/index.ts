import { api } from "@/apis";
import type { GetCalendarProps, GetCalendarResponse } from "./type";

export const getCalendar = async ({ year, month }: GetCalendarProps = {}) => {
  const hasPeriod = year !== undefined && month !== undefined;

  const response = await api.get<GetCalendarResponse>("/api/streak/calendar", {
    params: hasPeriod ? { year, month } : undefined,
  });

  return response.data;
};
