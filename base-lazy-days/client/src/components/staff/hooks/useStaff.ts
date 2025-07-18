import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

const GC_TIME = 1000 * 60 * 120; // 2 hours
const STALE_TIME = 1000 * 60 * 60; // 1 hour

// query function for useQuery
const getStaff = async (): Promise<Staff[]> => {
  const { data } = await axiosInstance.get("/staff");

  return data;
};

export const useStaff = () => {
  const [filter, setFilter] = useState("all");

  const selectFn = useCallback((unfilteredStaff: Staff[], filter: string) => {
    if (filter === "all") return unfilteredStaff;

    return filterByTreatment(unfilteredStaff, filter);
  }, []);

  const fallback: Staff[] = [];

  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: (data) => selectFn(data, filter),
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
    refetchIntervalInBackground: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { filter, setFilter, staff };
};
