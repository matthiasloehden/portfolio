const HEX_COLOR_PATTERN = /^#[\da-f]{6}(?:[\da-f]{2})?$/i;
const HEX_RGB_CHANNEL_PATTERN = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i;

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value);
}

export function normalizeHexColor(value: unknown): string | undefined {
  return isHexColor(value) ? value.toLowerCase() : undefined;
}

export function hexColorToRgbChannels(value: string): string | undefined {
  const match = HEX_RGB_CHANNEL_PATTERN.exec(value);
  if (!match) return undefined;

  const [, red = '00', green = '00', blue = '00'] = match;
  return `${Number.parseInt(red, 16)}, ${Number.parseInt(green, 16)}, ${Number.parseInt(blue, 16)}`;
}
