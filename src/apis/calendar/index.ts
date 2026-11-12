import { api } from "@/apis";
import type { GetCalendarProps, GetCalendarResponse } from "./type";

export const getCalendar = async (period: GetCalendarProps = {}) => {
  // 기간을 생략하면 이번 달을 반환한다.
  const params =
    period.year === undefined || period.month === undefined
      ? undefined
      : { year: period.year, month: period.month };

  const response = await api.get<GetCalendarResponse>("/api/streak/calendar", {
    params,
  });

  // TODO(임시): 응답 확인용 로그. 확인이 끝나면 제거할 것.
  if (__DEV__) {
    const { year, month, days } = response.data;

    console.log("[임시][calendar] 요청 params:", params ?? "(이번 달)");
    console.log(
      `[임시][calendar] ${year}-${month}, days ${days?.length ?? 0}개`,
    );
    console.log("[임시][calendar] days:", JSON.stringify(days));
  }

  return response.data;
};
