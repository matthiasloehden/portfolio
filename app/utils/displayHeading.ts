import type { DisplayHeadingLine } from '@/types/content';

export function getDisplayHeadingText(lines: DisplayHeadingLine[]): string {
  return lines.map((line) => `${line.text}${line.suffix ?? ''}`).join(' ');
}
