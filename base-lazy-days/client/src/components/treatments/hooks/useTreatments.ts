import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { Treatment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { createCustomError } from "@/react-query/queryClient";

const GC_TIME = 1000 * 60 * 120; // 2 hours
const STALE_TIME = 1000 * 60 * 60; // 1 hour

// query function for useQuery
const getTreatments = async (): Promise<Treatment[]> => {
  const { data } = await axiosInstance
    .get("/treatments")
    .then((data) => data)
    .catch((error: AxiosError) => {
      throw createCustomError(
        error,
        `Unable to fetch treatments: ${error.message}`
      );
    });

  return data;
};

export const useTreatments = (): Treatment[] => {
  const fallback: Treatment[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
    refetchIntervalInBackground: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return data;
};

export const usePrefetchTreatments = (): void => {
  const queryClient = useQueryClient();

  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
  });
};
