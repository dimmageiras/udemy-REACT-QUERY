import { useQuery } from "@tanstack/react-query";

import type { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { KeyFactories } from "@/react-query/key-factories";

const GC_TIME = 1000 * 60 * 0.1; // 6 seconds
const STALE_TIME = 1000 * 60 * 0.05; // 3 seconds

// for when we need a query function for useQuery
const getUserAppointments = async (
  userId: number,
  userToken: string
): Promise<Appointment[] | null> => {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });

  return data.appointments;
};

export const useUserAppointments = (): Appointment[] => {
  const { userId, userToken } = useLoginData();

  const { generateUserAppointmentsKey } = KeyFactories;

  const fallback: Appointment[] = [];

  const { data: appointments = fallback } = useQuery({
    queryKey: generateUserAppointmentsKey(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: true,
    enabled: !!userId && !!userToken,
  });

  return appointments;
};
