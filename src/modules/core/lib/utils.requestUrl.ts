export function buildRequestUrl(
  requestUrl: string,
  pathname: string,
): URL {
  return new URL(pathname, requestUrl);
}
