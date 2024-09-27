/* eslint-disable max-len */
export type QueryStatus = "pending" | "error" | "success";
export type FetchStatus = "fetching" | "paused" | "idle";

export type QueryKey = ReadonlyArray<unknown>;

export interface QueryObserverBaseResult<TData, TError> {
  /**
   * The last successfully resolved data for the query.
   */
  data: TData | undefined;
  /**
   * The error object for the query, if an error was thrown.
   * - Defaults to `null`.
   */
  error: TError | null;
  /**
   * A derived boolean from the `fetchStatus` variable, provided for convenience.
   * - `true` whenever the `queryFn` is executing, which includes initial `pending` as well as background refetch.
   */
  isFetching: boolean;
  /**
   * Is `true` whenever the first fetch for a query is in-flight.
   * - Is the same as `isFetching && isPending`.
   */
  isLoading: boolean;
  /**
   * Will be `true` if the query failed while fetching for the first time.
   */
  isLoadingError: boolean;
  /**
   * Is `true` whenever a background refetch is in-flight, which _does not_ include initial `pending`.
   * - Is the same as `isFetching && !isPending`.
   */
  isRefetching: boolean;
  /**
   * Will be `true` if the data in the cache is invalidated or if the data is older than the given `staleTime`.
   */
  isStale: boolean;
  /**
   * A derived boolean from the `status` variable, provided for convenience.
   * - `true` if the query has received a response with no errors and is ready to display its data.
   */
  isSuccess: boolean;
  /**
   * The status of the query.
   * - Will be:
   *   - `pending` if there's no cached data and no query attempt was finished yet.
   *   - `error` if the query attempt resulted in an error.
   *   - `success` if the query has received a response with no errors and is ready to display its data.
   */
  status: QueryStatus;
  /**
   * The fetch status of the query.
   * - `fetching`: Is `true` whenever the queryFn is executing, which includes initial `pending` as well as background refetch.
   * - `paused`: The query wanted to fetch, but has been `paused`.
   * - `idle`: The query is not fetching.
   * - See [Network Mode](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode) for more information.
   */
  fetchStatus: FetchStatus;
}

export type QueryObserverResult<TData, TError> =
  | QueryObserverSuccessResult<TData, TError>
  | QueryObserverLoadingResult<TData, TError>
  | QueryObserverLoadingErrorResult<TData, TError>;

export interface QueryObserverSuccessResult<TData = unknown, TError = unknown>
  extends QueryObserverBaseResult<TData, TError> {
  data: TData;
  error: null;
  isError: false;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  status: "success";
}

export interface QueryObserverLoadingResult<TData = unknown, TError = unknown>
  extends QueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: null;
  isError: false;
  isLoading: true;
  isSuccess: false;
  status: "pending";
}

export interface QueryObserverLoadingErrorResult<
  TData = unknown,
  TError = unknown,
> extends QueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: TError;
  isError: true;
  isLoading: false;
  isLoadingError: true;
  isSuccess: false;
  status: "error";
}

export interface QueryObserverOptions<
  TQueryFnData = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TError = unknown,
  TData = TQueryFnData,
> extends QueryOptions<TQueryFnData, TQueryKey> {
  enabled?: boolean;
  staleTime?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export interface QueryOptions<
  TQueryFnData = unknown,
  TQueryKey extends QueryKey = QueryKey,
> {
  gcTime?: number;
  queryFn?: () => Promise<TQueryFnData>;
  queryKey?: TQueryKey;
}

export type NotifyEventType = "added" | "removed" | "updated";

export interface NotifyEvent {
  type: NotifyEventType;
}
