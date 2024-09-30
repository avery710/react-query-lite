/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, Query } from "./query";
import { Subscribable } from "./Subscribable";
import { NotifyEvent, QueryKey } from "./types";

interface QueryCacheConfig {
  onError?: (error: Error, query: Query<unknown, unknown, unknown>) => void;
  onSuccess?: (data: unknown, query: Query<unknown, unknown, unknown>) => void;
}

interface NotifyEventQueryAdded extends NotifyEvent {
  type: "added";
  query: Query<any, any, any, any>;
}

interface NotifyEventQueryRemoved extends NotifyEvent {
  type: "removed";
  query: Query<any, any, any, any>;
}

interface NotifyEventQueryUpdated extends NotifyEvent {
  type: "updated";
  query: Query<any, any, any, any>;
  action: Action<any, any>;
}

export type QueryCacheNotifyEvent =
  | NotifyEventQueryAdded
  | NotifyEventQueryRemoved
  | NotifyEventQueryUpdated;

type QueryCacheListener = (event: QueryCacheNotifyEvent) => void;

export class QueryCache extends Subscribable<QueryCacheListener> {
  #queries: Map<string, Query>;

  // he config parameter is marked as public,
  // making it accessible as a property of the QueryCache instance.
  // TO CHECK: whether the config is necessary
  constructor(public config: QueryCacheConfig = {}) {
    super();
    this.#queries = new Map<string, Query>();
  }

  build() {
    // TODO: implement
  }

  add(query: Query<any, any, any, any>): void {
    if (this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
    }

    this.notify({ type: "added", query });
  }

  remove(query: Query<any, any, any, any>): void {
    const queryInMap = this.#queries.get(query.queryHash);

    if (queryInMap) {
      // TODO: query.destroy();

      if (query === queryInMap) {
        this.#queries.delete(query.queryHash);
      }

      this.notify({ type: "removed", query });
    }
  }

  clear(): void {
    this.getAll().forEach((query) => {
      this.remove(query);
    });
  }

  get<
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    queryHash: string
  ): Query<TQueryFnData, TError, TData, TQueryKey> | undefined {
    return this.#queries.get(queryHash) as
      | Query<TQueryFnData, TError, TData, TQueryKey>
      | undefined;
  }

  getAll(): Array<Query> {
    return [...this.#queries.values()];
  }

  find<TQueryFnData = unknown, TError = Error, TData = TQueryFnData>(
    queryKey: QueryKey
  ): Query<TQueryFnData, TError, TData> | undefined {
    return this.getAll().find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify(queryKey)
    ) as Query<TQueryFnData, TError, TData> | undefined;
  }

  notify(event: QueryCacheNotifyEvent) {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }
}
