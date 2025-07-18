import { act, renderHook, waitFor } from "@testing-library/react";

import { useStaff } from "../hooks/useStaff";

import { createQueryClientWrapper } from "@/test-utils";

describe("filter staff", () => {
  it("filter staff", async () => {
    const { result } = renderHook(() => useStaff(), {
      wrapper: createQueryClientWrapper(),
    });

    // wait for the staff to populate
    await waitFor(() => {
      expect(result.current.staff).toHaveLength(4);
    });

    // set to filter for only staff who give facial
    act(() => result.current.setFilter("facial"));

    // wait for count of staff to be greater than when filtered
    await waitFor(() => {
      expect(result.current.staff).toHaveLength(3);
    });
  });
});
