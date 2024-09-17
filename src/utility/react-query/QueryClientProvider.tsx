import * as React from 'react';
import { QueryClient } from "../query-core/queryClient";

export const QueryClientContext = React.createContext<QueryClient | undefined>(undefined);

export type QueryClientProviderProps = {
  client: QueryClient;
  children?: React.ReactNode;
}

export const QueryClientProvider = (props: QueryClientProviderProps) => {
  const { client, children } = props;

  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
};
