// Palette: first 3 are exactly as requested, followed by more accents
export const PIE_COLORS = [
  "#29ffaf", // warm: amber
  "#ff2979", // cool: emerald
  "#ffaf29", // warm: orange
  "#0D9488", // cool: teal
  "#EF4444", // warm: red
  "#84CC16", // cool: lime
  "#FFC857", // warm: gold
  "#06B6D4", // cool: cyan
  "#FF7A59", // warm: tangerine
  "#10B981", // cool: jade
];

export function splitsCounterToPieData(splitsCounter) {
  // Normalize entries from Map or plain object
  const entries =
    splitsCounter instanceof Map
      ? Array.from(splitsCounter.entries())
      : Object.entries(splitsCounter ?? {});

  // Optional: sort by value desc for nicer ordering
  entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

  // Map to gifted-charts pie format
  return entries
    .map(([label, value], i) => ({
      value: Number(value) || 0,
      color: PIE_COLORS[i % PIE_COLORS.length],
      text: String(label),
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
}
