"use client";

import * as React from "react";

export function CookieSettingsTrigger() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("webix:open-cookie-settings"));
        }
      }}
      className="hover:text-white transition-colors underline underline-offset-2"
    >
      Cookie Settings
    </button>
  );
}
