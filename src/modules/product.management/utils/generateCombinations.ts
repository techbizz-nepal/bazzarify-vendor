export default function generateCombinations(
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
