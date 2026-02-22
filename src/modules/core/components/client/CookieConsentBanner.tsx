"use client";

import {
  COOKIE_CONSENT_NAME,
  type CookieConsentValue,
} from "@/modules/core/constants/cookies";
import { getCookie, setCookie } from "@/modules/core/lib/utils.cookies.client";
import { useEffect, useState } from "react";

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const existing = getCookie(COOKIE_CONSENT_NAME);
    setVisible(!existing);
  }, []);

  const choose = (value: CookieConsentValue) => {
    setCookie(COOKIE_CONSENT_NAME, value);
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full rounded-lg border bg-white shadow-lg p-4 sm:p-5">
        <h3 className="text-base font-semibold mb-2">We use cookies</h3>
        <p className="text-sm text-gray-600 mb-4">
          We use essential cookies to make this site work. With your consent, we
          may also use additional cookies to enhance your experience. You can
          choose Essential Only or Accept All.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose("full")}
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:opacity-90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
