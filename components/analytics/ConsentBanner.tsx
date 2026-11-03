"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { OPEN_COOKIE_SETTINGS } from "./CookieSettingsTrigger";

const KEY = "hs_cookie_consent_v1";
type Consent = "accepted" | "declined" | "unset";

/**
 * Cookie consent (adapted from reference/webix/components/analytics/consent-banner.tsx).
 * GA4 and Microsoft Clarity load ONLY after "Accept analytics". Nothing loads by default.
 */
export function ConsentBanner() {
  const [consent, setConsent] = useState<Consent>("unset");
  const [visible, setVisible] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const hasAnalytics = Boolean(gaId || clarityId);

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading persisted choice once on mount
    if (saved === "accepted" || saved === "declined") setConsent(saved);
    else if (hasAnalytics) setVisible(true);
    const open = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open);
  }, [hasAnalytics]);

  const choose = (c: "accepted" | "declined") => {
    window.localStorage.setItem(KEY, c);
    setConsent(c);
    setVisible(false);
    if (c === "declined" && consent === "accepted") window.location.reload();
  };

  return (
    <>
      {consent === "accepted" && gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {consent === "accepted" && clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}

      {visible && (
        <aside
          aria-label="Cookie consent"
          className="glass glass--text fixed bottom-[88px] left-3 right-3 z-[45] p-5 text-white md:bottom-5 md:left-5 md:right-auto md:max-w-[400px]"
        >
          <p className="font-display text-lg font-medium">Cookies and analytics</p>
          <p className="mt-1.5 text-sm leading-relaxed text-fog">
            Optional analytics (Google Analytics and Microsoft Clarity) help me see which pages are useful. They load only if
            you accept.{" "}
            <Link href="/privacy/" className="text-white underline underline-offset-2">
              Privacy
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn--primary min-h-[44px] px-4 text-sm" onClick={() => choose("accepted")}>
              Accept analytics
            </button>
            <button type="button" className="btn btn--glass min-h-[44px] px-4 text-sm" onClick={() => choose("declined")}>
              Essential only
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
