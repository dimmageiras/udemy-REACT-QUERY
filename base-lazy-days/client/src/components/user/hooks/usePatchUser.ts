import { useMutation, useQueryClient } from "@tanstack/react-query";
import jsonpatch from "fast-json-patch";

import type { Appointment, User } from "@shared/types";

import { useUser } from "./useUser";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { toast } from "@/components/app/toast";
import { KeyFactories } from "@/react-query/key-factories";

// for when we need a server function
const patchUserOnServer = async (
  newData: User | null,
  originalData: User | null
): Promise<User | null> => {
  if (!newData || !originalData) return null;
  //   // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  //   // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    }
  );
  return data.user;
};

export const usePatchUser = () => {
  const { user } = useUser();
  const { setLoginData, userId, userToken } = useLoginData();
  const queryClient = useQueryClient();

  const { generateUpdatedUserKey } = KeyFactories;
  const updatedUserKey = generateUpdatedUserKey();

  const { mutate: patchUser } = useMutation({
    mutationKey: updatedUserKey,
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onMutate: () => {
      // Preserve user appointments data for optimistic updates
      const currentUserAppointments = queryClient.getQueryData<Appointment[]>(
        KeyFactories.generateUserAppointmentsKey(userId, userToken)
      );

      return {
        previousUser: user,
        previousUserAppointments: currentUserAppointments,
      };
    },
    onSuccess: (userData, _variables, context) => {
      toast({
        status: "success",
        title: "User updated!",
      });

      // Update the cache directly with the server response
      if (userData) {
        queryClient.setQueryData(
          KeyFactories.generateUserKey(userData.id, userData.token),
          userData
        );
      }

      // If the token has changed, clean up the old cache entries and transfer appointments
      if (userData && userData.token !== user?.token) {
        // Transfer user appointments to the new cache key before removing old entries
        // This prevents the appointments from disappearing during the transition
        if (context?.previousUserAppointments) {
          queryClient.setQueryData(
            KeyFactories.generateUserAppointmentsKey(
              userData.id,
              userData.token
            ),
            context.previousUserAppointments
          );
        }

        // Remove the old cache entry with the old token
        queryClient.removeQueries({
          queryKey: KeyFactories.generateUserKey(userId, userToken),
        });

        // Also remove user appointments cache with the old token
        queryClient.removeQueries({
          queryKey: KeyFactories.generateUserAppointmentsKey(userId, userToken),
        });

        // Update the auth context with new token
        setLoginData({ userId: userData.id, userToken: userData.token });

        // Invalidate the appointments query to trigger a refetch with the new token
        // This ensures the appointments are up-to-date after the token change
        queryClient.invalidateQueries({
          queryKey: KeyFactories.generateUserAppointmentsKey(
            userData.id,
            userData.token
          ),
        });
      }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (
      _error,
      _newUserData,
      context:
        | { previousUser: User; previousUserAppointments?: Appointment[] }
        | undefined
    ) => {
      if (context?.previousUser) {
        queryClient.setQueryData(
          KeyFactories.generateUserKey(userId, userToken),
          context.previousUser
        );
      }

      // Restore user appointments if they were preserved
      if (context?.previousUserAppointments) {
        queryClient.setQueryData(
          KeyFactories.generateUserAppointmentsKey(userId, userToken),
          context.previousUserAppointments
        );
      }

      toast({
        status: "error",
        title: "Update failed",
        description: "Your changes have been reverted.",
      });
    },
  });

  return patchUser;
};
