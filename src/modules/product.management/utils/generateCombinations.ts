export function generateCombinations(
  attributes: Record<string, string[]>,
): string[][] {
  const keys = Object.keys(attributes);
  if (!keys.length) return [];

  return keys.reduce<string[][]>(
    (acc, key) => {
      const values = attributes[key];
      return acc.flatMap((combo) => values.map((value) => [...combo, value]));
    },
    [[]],
  );
}

export function testCombination(variantSelections: Record<string, string[]>) {
  const entries = Object.entries(variantSelections).filter(
    ([, values]) => values.length > 0,
  );
  if (entries.length === 0) return []; // no attribute values selected
  if (entries.length === 1) {
    return entries[0][1].map((value) => [value]); // map to single-value combos
  }
  return generateCombinations(variantSelections); // default behavior for >1 attribute
}
