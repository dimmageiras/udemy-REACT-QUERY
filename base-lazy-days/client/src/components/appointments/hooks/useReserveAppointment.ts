import { useMutation } from "@tanstack/react-query";

import type { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { KeyFactories } from "@/react-query/key-factories";
import { queryClient } from "@/react-query/queryClient";

// for when we need functions for useMutation
const setAppointmentUser = async (
  appointment: Appointment,
  userId: number | undefined
): Promise<void> => {
  if (!userId) return;

  const patchOp = appointment.userId ? "replace" : "add";
  const patchData = [{ op: patchOp, path: "/userId", value: userId }];

  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
};

export const useReserveAppointment = () => {
  const { userId } = useLoginData();

  const toast = useCustomToast();

  const { generateAppointmentsKey } = KeyFactories;

  const { mutate: reserveAppointment } = useMutation({
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: generateAppointmentsKey(userId),
      });
      toast({
        title: "You have reserved an appointment!",
        status: "success",
      });
    },
  });

  return reserveAppointment;
};
