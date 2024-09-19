import { QueryKey, QueryObserverOptions } from "../query-core/types";

export type UseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = QueryObserverOptions<TQueryFnData, TQueryKey, TError, TData>;
