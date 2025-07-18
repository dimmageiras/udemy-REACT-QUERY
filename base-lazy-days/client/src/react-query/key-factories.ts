import { QueryKey } from "@tanstack/react-query";

import { queryKeys } from "./constants";

const generateAppointmentsKey = (userId: number | undefined): string[] =>
  userId ? [queryKeys.user, queryKeys.appointments] : [queryKeys.appointments];

const generateUpdatedUserKey = (): QueryKey => ["patch-user"];

const generateUserAppointmentsKey = (
  userId: number,
  userToken: string
): QueryKey => [queryKeys.user, queryKeys.appointments, userId, userToken];

const generateUserKey = (userId: number, userToken: string): QueryKey => [
  queryKeys.user,
  userId,
  userToken,
];

export const KeyFactories = {
  generateAppointmentsKey,
  generateUpdatedUserKey,
  generateUserAppointmentsKey,
  generateUserKey,
};
