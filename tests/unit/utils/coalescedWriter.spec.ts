import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCoalescedWriter } from '@/utils/coalescedWriter';

afterEach(() => {
  vi.useRealTimers();
});

describe('createCoalescedWriter', () => {
  it('writes only the latest value after rapid updates', () => {
    vi.useFakeTimers();
    const write = vi.fn<(value: string) => void>();
    const writer = createCoalescedWriter(write, 100);

    writer.schedule('first');
    vi.advanceTimersByTime(80);
    writer.schedule('latest');
    vi.advanceTimersByTime(99);

    expect(write).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(write).toHaveBeenCalledOnce();
    expect(write).toHaveBeenCalledWith('latest');
  });

  it('flushes pending work exactly once at a lifecycle boundary', () => {
    vi.useFakeTimers();
    const write = vi.fn<(value: number) => void>();
    const writer = createCoalescedWriter(write, 100);

    writer.schedule(42);
    writer.flush();
    vi.runAllTimers();

    expect(write).toHaveBeenCalledOnce();
    expect(write).toHaveBeenCalledWith(42);
  });

  it('discards pending work when cancelled', () => {
    vi.useFakeTimers();
    const write = vi.fn<(value: number) => void>();
    const writer = createCoalescedWriter(write, 100);

    writer.schedule(42);
    writer.cancel();
    vi.runAllTimers();

    expect(write).not.toHaveBeenCalled();
  });
});
