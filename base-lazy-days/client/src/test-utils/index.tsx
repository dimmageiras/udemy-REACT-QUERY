import { ChakraProvider } from "@chakra-ui/react";
import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as RtlRender } from "@testing-library/react";
import { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { queryClientOptions } from "@/react-query/queryClient";

// make a function to generate a unique query client for each test
const generateQueryClient = (config?: QueryClientConfig) => {
  if (config) {
    if (config.defaultOptions.queries.retry) {
      config.defaultOptions.queries.retry = false;
    }
  } else {
    queryClientOptions.defaultOptions.queries.retry = false;
  }

  return new QueryClient(config || queryClientOptions);
};

type CustomRenderOptions =
  | {
      client?: QueryClient;
      clientConfig?: never;
    }
  | {
      client?: never;
      clientConfig?: QueryClientConfig;
    };

// ** FOR TESTING CUSTOM HOOKS ** //
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  const queryClient = generateQueryClient();

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const queryClient =
    options?.client ?? generateQueryClient(options?.clientConfig);

  return RtlRender(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
