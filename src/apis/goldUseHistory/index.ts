import { api } from "@/apis";
import type { GetGoldUseHistoryProps, GetGoldUseHistoryResponse } from "./type";

export const getGoldUseHistory = async ({
  page,
  size,
}: GetGoldUseHistoryProps = {}) => {
  const response = await api.get<GetGoldUseHistoryResponse>(
    "/api/streak/gold",
    {
      params: {
        ...(page === undefined ? {} : { page }),
        ...(size === undefined ? {} : { size }),
      },
    },
  );

  return response.data;
};
