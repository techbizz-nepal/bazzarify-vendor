export function getRequestHostname(headers: Headers): string {
  const forwardedHost = headers.get("x-forwarded-host");
  const host = forwardedHost ?? headers.get("host") ?? "";
  const firstHost = host.split(",")[0]?.trim();

  if (!firstHost) {
    return "";
  }

  try {
    return new URL(`https://${firstHost}`).hostname;
  } catch {
    return firstHost.split(":")[0] ?? "";
  }
}
