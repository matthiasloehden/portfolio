import { cancelIdleCallback, requestIdleCallback } from '#app';

interface IdleTaskOptions {
  priority?: number;
  timeout?: number;
}

interface QueuedIdleTask extends Required<IdleTaskOptions> {
  id: number;
  run: () => void;
}

const queuedTasks: QueuedIdleTask[] = [];
let nextTaskId = 1;
let paintFrame: number | undefined;
let idleCallback: number | undefined;

function sortQueue(): void {
  queuedTasks.sort((left, right) => right.priority - left.priority || left.id - right.id);
}

function cancelScheduledRun(): void {
  if (paintFrame !== undefined) window.cancelAnimationFrame(paintFrame);
  if (idleCallback !== undefined) cancelIdleCallback(idleCallback);
  paintFrame = undefined;
  idleCallback = undefined;
}

function scheduleNextTask(): void {
  if (queuedTasks.length === 0 || paintFrame !== undefined || idleCallback !== undefined) return;

  paintFrame = window.requestAnimationFrame(() => {
    paintFrame = undefined;
    const timeout = queuedTasks[0]?.timeout;

    idleCallback = requestIdleCallback(
      () => {
        idleCallback = undefined;
        const task = queuedTasks.shift();

        try {
          task?.run();
        } finally {
          scheduleNextTask();
        }
      },
      { timeout },
    );
  });
}

/**
 * Queues non-critical client work by priority. Limiting execution to one task
 * per idle frame prevents independent initializers from competing in the same
 * paint window, while cancellation keeps component teardown isolated.
 */
export function enqueueIdleTask(run: () => void, options: IdleTaskOptions = {}): () => void {
  const task: QueuedIdleTask = {
    id: nextTaskId++,
    priority: options.priority ?? 0,
    timeout: options.timeout ?? 1_000,
    run,
  };

  queuedTasks.push(task);
  sortQueue();
  scheduleNextTask();

  return () => {
    const taskIndex = queuedTasks.findIndex((candidate) => candidate.id === task.id);
    if (taskIndex !== -1) queuedTasks.splice(taskIndex, 1);
    if (queuedTasks.length === 0) cancelScheduledRun();
  };
}
