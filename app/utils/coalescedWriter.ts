export interface CoalescedWriter<Value> {
  schedule: (value: Value) => void;
  flush: () => void;
  cancel: () => void;
}

/**
 * Coalesces rapid updates while retaining explicit flush and cancellation for
 * browser lifecycle boundaries such as pagehide and preference resets.
 */
export function createCoalescedWriter<Value>(write: (value: Value) => void, delay: number): CoalescedWriter<Value> {
  let pending: { value: Value } | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function clearTimer(): void {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  }

  function cancel(): void {
    clearTimer();
    pending = undefined;
  }

  function flush(): void {
    clearTimer();
    if (!pending) return;

    const entry = pending;
    pending = undefined;
    write(entry.value);
  }

  function schedule(value: Value): void {
    pending = { value };
    clearTimer();
    timer = setTimeout(flush, delay);
  }

  return { schedule, flush, cancel };
}
