export const COOKIE_CONSENT_NAME = "cookie_consent" as const;
export type CookieConsentValue = "essential" | "full";

export const COOKIE_CONSENT_MAX_AGE_DAYS = 180; // 6 months

export const COOKIE_PATH = "/" as const;
export const COOKIE_SAMESITE: "lax" | "strict" | "none" = "lax";