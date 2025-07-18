import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { KeyFactories } from "@/react-query/key-factories";

// query function
const getUser = async (userId: number, userToken: string): Promise<User> => {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
};

export const useUser = (): {
  user: User;
  updateUser: (newUser: User) => void;
  clearUser: () => void;
} => {
  const queryClient = useQueryClient();

  // get details on the userId
  const { userId, userToken } = useLoginData();

  const { generateUserKey } = KeyFactories;

  // call useQuery to update user data from server
  const { data: user } = useQuery({
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
    enabled: !!userId && !!userToken,
  });

  // meant to be called from useAuth
  const updateUser = (newUser: User): void => {
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    );
  };

  // meant to be called from useAuth
  const clearUser = (): void => {
    queryClient.removeQueries({
      queryKey: [queryKeys.user],
    });
  };

  return {
    clearUser,
    updateUser,
    user,
  };
};
