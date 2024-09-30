// declare Removable class as abstract
// so that it can only be extended by other classes
// rather than being instantiated directly
export abstract class Removable {
  #gcTimeout?: ReturnType<typeof setTimeout>;

  // exclamation mark is used to tell TypeScript that
  // gcTime will be assigned later for sure
  gcTime!: number;

  destroy(): void {
    this.clearGcTimeout();
  }

  protected scheduleGc(): void {
    this.clearGcTimeout();

    this.#gcTimeout = setTimeout(() => {
      this.optionalRemove();
    }, this.gcTime);
  }

  protected clearGcTimeout(): void {
    if (this.#gcTimeout) {
      clearTimeout(this.#gcTimeout);
      this.#gcTimeout = undefined;
    }
  }

  protected updateGcTime(newGcTime?: number): void {
    // Default to 5 minutes if no gcTime is set
    this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? 5 * 60 * 1000);
  }

  protected abstract optionalRemove(): void;
}
