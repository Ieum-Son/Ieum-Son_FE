import { getCalendar } from "@/apis/calendar";
import type {
  GetCalendarProps,
  GetCalendarResponse,
} from "@/apis/calendar/type";
import { useQuery } from "@tanstack/react-query";
import { createErrorMessage } from "../errorResponse";

export const CALENDAR_QUERY_KEY = ["calendar"];

export const getCalendarErrorMessage = createErrorMessage({
  status: {
    401: "인증이 필요합니다.",
    404: "해당 유저가 존재하지 않습니다.",
  },
  preferServerMessage: true,
  fallback: "학습 기록을 불러오는 데 실패했습니다.",
});

export const useCalendar = (period: GetCalendarProps = {}) =>
  useQuery<GetCalendarResponse, Error>({
    queryKey: [
      ...CALENDAR_QUERY_KEY,
      period.year ?? null,
      period.month ?? null,
    ],
    queryFn: () => getCalendar(period),
  });
