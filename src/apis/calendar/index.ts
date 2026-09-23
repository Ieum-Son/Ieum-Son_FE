import { api } from "@/apis";
import type { GetCalendarProps, GetCalendarResponse } from "./type";

export const getCalendar = async (period: GetCalendarProps = {}) => {
  const params =
    period.year === undefined || period.month === undefined
      ? undefined
      : { year: period.year, month: period.month };

  const response = await api.get<GetCalendarResponse>("/api/streak/calendar", {
    params,
  });

  return response.data;
};
