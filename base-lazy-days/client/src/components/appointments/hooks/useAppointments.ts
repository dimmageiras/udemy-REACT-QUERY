import type { Query } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import { getMonthYearDetails, getNewMonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import type { AppointmentDateMap } from "@/components/appointments/types";
import { getAvailableAppointments } from "@/components/appointments/utils";
import { KeyFactories } from "@/react-query/key-factories";

const GC_TIME = 1000 * 60 * 0.1; // 6 seconds
const STALE_TIME = 1000 * 60 * 0.05; // 3 seconds

// for useQuery call
const getAppointments = async (
  year: string,
  month: string
): Promise<AppointmentDateMap> => {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);

  return data;
};

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export const useAppointments = () => {
  const queryClient = useQueryClient();

  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  const updateMonthYear = (monthIncrement: number): void => {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  };
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { userId } = useLoginData();

  const selectFn = useCallback(
    (appointments: AppointmentDateMap) => {
      if (showAll) {
        return appointments;
      }

      return getAvailableAppointments(appointments);
    },
    [showAll]
  );

  const { generateAppointmentsKey } = KeyFactories;

  /** ****************** END 2: filter appointments  ******************** */
  /** ****************** START 3: useQuery  ***************************** */
  // useQuery call for appointments for the current monthYear

  const nextMonthYear = getNewMonthYear(monthYear, 1);
  const previousMonthYear = getNewMonthYear(monthYear, -1);

  const manageAdjacentMonthQueries = useCallback(
    (action: "refetch" | "prefetch") => {
      if (!action) {
        action = "prefetch";
      }

      const isNotPreviousMonth =
        previousMonthYear.month !==
          getNewMonthYear(currentMonthYear, -1).month ||
        previousMonthYear.year !== getNewMonthYear(currentMonthYear, -1).year;

      if (action === "prefetch") {
        if (isNotPreviousMonth) {
          queryClient.prefetchQuery({
            queryKey: [
              ...generateAppointmentsKey(userId),
              previousMonthYear.year,
              previousMonthYear.month,
            ],
            queryFn: () =>
              getAppointments(previousMonthYear.year, previousMonthYear.month),
            gcTime: GC_TIME,
            staleTime: STALE_TIME,
          });
        }

        queryClient.prefetchQuery({
          queryKey: [
            ...generateAppointmentsKey(userId),
            nextMonthYear.year,
            nextMonthYear.month,
          ],
          queryFn: () =>
            getAppointments(nextMonthYear.year, nextMonthYear.month),
          gcTime: GC_TIME,
          staleTime: STALE_TIME,
        });
      }

      if (action === "refetch") {
        if (isNotPreviousMonth) {
          queryClient.refetchQueries({
            queryKey: [
              ...generateAppointmentsKey(userId),
              previousMonthYear.year,
              previousMonthYear.month,
            ],
          });
        }

        queryClient.refetchQueries({
          queryKey: [
            ...generateAppointmentsKey(userId),
            nextMonthYear.year,
            nextMonthYear.month,
          ],
        });
      }
    },
    [
      currentMonthYear,
      generateAppointmentsKey,
      nextMonthYear,
      previousMonthYear,
      queryClient,
      userId,
    ]
  );

  const handleOnRefetch = useCallback(
    ({
      state,
    }: Query<
      AppointmentDateMap,
      Error,
      AppointmentDateMap,
      string[]
    >): boolean => {
      const dataUpdatedAt = state.dataUpdatedAt;
      const isStale = dataUpdatedAt + STALE_TIME < Date.now();

      Reflect.set(state, "dataUpdatedAt", 0);

      if (isStale) {
        console.info("prefetching");
        manageAdjacentMonthQueries("prefetch");
      } else {
        console.info("refetching");
        manageAdjacentMonthQueries("refetch");
      }

      return true;
    },
    [manageAdjacentMonthQueries]
  );

  const fallback: AppointmentDateMap = {};

  const { data: appointments = fallback } = useQuery({
    queryKey: [
      ...generateAppointmentsKey(userId),
      monthYear.year,
      monthYear.month,
    ],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    select: (appointments) => selectFn(appointments),
    refetchIntervalInBackground: true,
    refetchInterval: (query) => {
      const isStale = query.state.dataUpdatedAt + STALE_TIME < Date.now();

      if (isStale) {
        handleOnRefetch(query);
      }

      return STALE_TIME;
    },
    refetchOnMount: handleOnRefetch,
    refetchOnReconnect: handleOnRefetch,
    refetchOnWindowFocus: handleOnRefetch,
  });

  useEffect(() => {
    manageAdjacentMonthQueries("prefetch");
  }, [manageAdjacentMonthQueries]);

  /** ****************** END 3: useQuery  ******************************* */

  return {
    appointments,
    monthYear,
    setShowAll,
    showAll,
    updateMonthYear,
  };
};
