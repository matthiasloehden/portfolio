/**
 * Creates the reactive canvas and fallback state used by every background.
 *
 * Initialization and context errors are normalized to a displayable reason so
 * each Vue component can expose the same CSS fallback contract. The composable
 * does not initialize a renderer; ownership of resources and retry behavior
 * remains explicit in the scene controller.
 */
import { ref } from 'vue';

export function useBackgroundCanvas() {
  const canvas = ref<HTMLCanvasElement | null>(null);
  const failed = ref(false);
  const failureReason = ref<string | null>(null);

  function clearFailure(): void {
    failed.value = false;
    failureReason.value = null;
  }

  function setFailure(reason: unknown, fallback = 'Initialization failed'): void {
    failed.value = true;
    failureReason.value = reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : fallback;
  }

  return {
    canvas,
    failed,
    failureReason,
    clearFailure,
    setFailure,
  };
}
