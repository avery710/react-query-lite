export class Subscribable<TListener> {
  protected listeners = new Set<TListener>();

  constructor() {
    // to ensure when other classes extend this class,
    // the `subscribe` method is bound to the scope where it is called
    // ex: call super() in queryObserver constructor,
    // binds the subscribe method to the queryObserver instance
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: TListener) {
    this.listeners.add(listener);

    this.onSubscribe();

    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }

  hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  protected onSubscribe(): void {}

  protected onUnsubscribe(): void {}
}
