export function isHostUnderSubdomain(host: string, subdomain: string): boolean {
  const normalizedHost = normalizeHost(host);
  const normalizedSubdomain = normalizeHost(subdomain);

  const [hostSubdomain] = normalizedHost.split(".");

  return hostSubdomain === normalizedSubdomain;
}

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/\.$/, "").replace(/:\d+$/, "");
}

export function isPathUnderRoute(
  pathname: string,
  routePrefixes: readonly string[],
): boolean {
  return routePrefixes.some(
    (routePrefix) =>
      pathname === routePrefix || pathname.startsWith(`${routePrefix}/`),
  );
}
