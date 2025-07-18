import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { KeyFactories } from "@/react-query/key-factories";

// for when server call is needed
const removeAppointmentUser = async (
  appointment: Appointment
): Promise<void> => {
  const patchData = [{ op: "remove", path: "/userId" }];

  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  const { userId } = useLoginData();
  const toast = useCustomToast();

  const { generateAppointmentsKey } = KeyFactories;

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: removeAppointmentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: generateAppointmentsKey(userId),
      });
      toast({
        status: "warning",
        title: "You have cancelled the appointment",
      });
    },
  });

  return cancelAppointment;
};
