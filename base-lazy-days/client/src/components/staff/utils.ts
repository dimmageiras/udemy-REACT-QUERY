import type { Staff } from "@shared/types";

export const filterByTreatment = (
  staff: Staff[],
  treatmentName: string
): Staff[] => {
  return staff.filter((person) =>
    person.treatmentNames
      .map((t) => t.toLowerCase())
      .includes(treatmentName.toLowerCase())
  );
};
