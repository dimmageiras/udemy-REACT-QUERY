import dayjs from "dayjs";

import type { Appointment, AppointmentDateMap } from "@shared/types";

export const appointmentInPast = (appointmentData: Appointment): boolean => {
  const now = dayjs();

  return dayjs(appointmentData.dateTime) < now;
};

export const getAppointmentColor = (
  appointmentData: Appointment,
  userId: number | undefined
): [string, string] => {
  const taken = !!appointmentData.userId;

  if (taken || appointmentInPast(appointmentData)) {
    const textColor = "black";
    const bgColor =
      userId && appointmentData.userId === userId ? "white" : "gray.300";

    return [textColor, bgColor];
  }
  const textColor = "white";

  switch (appointmentData.treatmentName.toLowerCase()) {
    case "massage":
      return [textColor, "purple.700"];
    case "scrub":
      return [textColor, "blue.700"];
    case "facial":
      return [textColor, "green.700"];
    default:
      return [textColor, "black"];
  }
};

export const getAvailableAppointments = (
  appointments: AppointmentDateMap
): AppointmentDateMap => {
  // clone so as not to mutate argument directly
  const filteredAppointments = { ...appointments };

  Object.keys(filteredAppointments).forEach((date) => {
    const dateNum = Number(date);

    filteredAppointments[dateNum] = filteredAppointments[dateNum].filter(
      (appointment: Appointment) =>
        !appointment.userId && !appointmentInPast(appointment)
    );
  });

  return filteredAppointments;
};
