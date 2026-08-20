export type TSearchParamsRecord = Record<string, string | string[] | undefined>;

export const normalizeSingleSearchParam = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export const flattenSearchParams = (
  searchParams: TSearchParamsRecord,
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(searchParams)
      .map(([key, value]) => [key, normalizeSingleSearchParam(value)])
      .filter(([, value]) => value.length > 0),
  );
};
