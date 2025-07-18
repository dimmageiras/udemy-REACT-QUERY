import { act, renderHook, waitFor } from "@testing-library/react";

import { useAppointments } from "../hooks/useAppointments";
import { AppointmentDateMap } from "../types";

import { createQueryClientWrapper } from "@/test-utils";

// a helper function to get the number of appointments from an AppointmentDateMap
const getAppoinmentCount = (appointments: AppointmentDateMap) => {
  return Object.values(appointments).reduce(
    (runningCount, appointmentsOnDate) =>
      runningCount + appointmentsOnDate.length,
    0
  );
};

describe("filter appointments by availability", () => {
  it("filter appointments by availability", async () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: createQueryClientWrapper(),
    });

    // wait for appointments to populate
    await waitFor(() => {
      expect(getAppoinmentCount(result.current.appointments)).toBeGreaterThan(
        0
      );
    });

    // appointments start out filtered (show only available)
    const filteredAppointmentLength = getAppoinmentCount(
      result.current.appointments
    );

    // set to return all appointments
    act(() => result.current.setShowAll(true));

    // wait for count of appointments to be greater than when filtered
    await waitFor(() => {
      expect(getAppoinmentCount(result.current.appointments)).toBeGreaterThan(
        filteredAppointmentLength
      );
    });
  });
});
