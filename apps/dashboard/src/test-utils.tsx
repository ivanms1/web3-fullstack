import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";

// Create a custom render function that includes providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity, // Prevent refetching during tests
      },
    },
  });

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): ReturnType<typeof render> & { queryClient: QueryClient } => {
  const queryClient = createTestQueryClient();

  // Clear the query cache before each test
  queryClient.clear();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
};

// Export the custom render function and QueryClient utilities for tests that need them
export { customRender as render };
export { createTestQueryClient };
export { QueryClient, QueryClientProvider };
