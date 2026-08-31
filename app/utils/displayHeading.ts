import type { DisplayHeadingTitle } from '@/types/content';

export function getDisplayHeadingText(title: DisplayHeadingTitle): string {
  if (typeof title === 'string') {
    return title;
  }

  return title.map((line) => (typeof line === 'string' ? line : line.join(''))).join(' ');
}
