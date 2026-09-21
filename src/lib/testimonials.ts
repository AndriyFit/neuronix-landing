export function splitTestimonialsIntoColumns<T>(items: readonly T[]): T[][] {
  const midpoint = Math.ceil(items.length / 2)

  return [items.slice(0, midpoint), items.slice(midpoint)]
}
