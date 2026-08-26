import type { BackgroundPerformanceStats } from '@/types/background';

/** Shares live renderer diagnostics with controls outside the background tree. */
export function useBackgroundRuntimeStatus() {
  const performanceStats = useState<BackgroundPerformanceStats | null>(
    'portfolio-background-performance-stats',
    () => null,
  );

  return { performanceStats };
}
