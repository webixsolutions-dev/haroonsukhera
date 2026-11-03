"use client";

export const OPEN_COOKIE_SETTINGS = "hs:open-cookie-settings";

export function CookieSettingsTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}
      className="inline-flex min-h-[40px] items-center hover:text-white"
    >
      Cookie settings
    </button>
  );
}
