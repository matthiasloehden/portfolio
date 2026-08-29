export function selectByRandomValue<Item>(items: readonly Item[], randomValue: number): Item {
  const first = items[0];
  if (first === undefined) throw new Error('Cannot select from an empty collection.');

  const normalizedValue = Number.isFinite(randomValue) ? Math.min(Math.max(randomValue, 0), 1) : 0;
  const index = Math.min(Math.floor(normalizedValue * items.length), items.length - 1);
  return items[index] ?? first;
}
