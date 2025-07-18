import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientConfig,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { toast } from "@/components/app/toast";

// Type for errors that can include custom messages
interface CustomError extends Error {
  customMessage?: string;
}

// Helper function to create custom errors
export const createCustomError = (
  originalError: AxiosError,
  customMessage: string
): CustomError => {
  const customError: CustomError = new Error(originalError.message);

  Reflect.set(customError, "customMessage", customMessage);
  Reflect.set(customError, "stack", originalError.stack);

  return customError;
};

const GC_TIME = 1000 * 60 * 15; // 15 minutes
const STALE_TIME = 1000 * 60 * 10; // 10 minutes

const createTitle = (
  errorMsg: string,
  actionType: "mutation" | "query",
  customMessage?: string
) => {
  if (customMessage) {
    return customMessage;
  }

  const action = actionType === "query" ? "fetch" : "update";

  return `could not ${action} data: ${
    errorMsg ?? "error connecting to server"
  }`;
};

const errorHandler = (title: string) => {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
};

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      gcTime: GC_TIME,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: STALE_TIME,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: CustomError) => {
      const customMessage = error.customMessage;
      const title = createTitle(error.message, "mutation", customMessage);

      errorHandler(title);
    },
  }),
  queryCache: new QueryCache({
    onError: (error: CustomError) => {
      const customMessage = error.customMessage;
      const title = createTitle(error.message, "query", customMessage);

      errorHandler(title);
    },
  }),
};

export const queryClient = new QueryClient(queryClientOptions);
