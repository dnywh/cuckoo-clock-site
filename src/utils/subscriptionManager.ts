import type { Store } from "nanostores";

type Unsubscriber = () => void;

export function createSubscriptionManager() {
  let unsubscribers: Unsubscriber[] = [];

  function subscribe<T>(store: Store<T>, callback: (value: T) => void): void {
    const unsubscribe = store.subscribe(callback);
    unsubscribers.push(unsubscribe);
  }

  function unsubscribeAll(): void {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    unsubscribers = [];
  }

  return {
    subscribe,
    unsubscribeAll,
  };
}
