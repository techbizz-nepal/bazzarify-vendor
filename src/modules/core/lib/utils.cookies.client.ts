"use client";

import { COOKIE_CONSENT_MAX_AGE_DAYS, COOKIE_PATH, COOKIE_SAMESITE } from "@/modules/core/constants/cookies";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1") + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, days = COOKIE_CONSENT_MAX_AGE_DAYS) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60; // seconds
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAge}`,
    `Path=${COOKIE_PATH}`,
    `SameSite=${COOKIE_SAMESITE}`,
  ];
  // In production on HTTPS, consider adding Secure; we keep it simple here.
  document.cookie = parts.join("; ");
}
