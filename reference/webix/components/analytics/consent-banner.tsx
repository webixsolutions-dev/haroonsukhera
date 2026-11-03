"use client";

import * as React from "react";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";

const CONSENT_STORAGE_KEY = "webix_cookie_consent_v1";

type ConsentState = "accepted" | "declined" | "unset";

export function ConsentBanner() {
  const [consent, setConsent] = React.useState<ConsentState>("unset");
  const [visible, setVisible] = React.useState(false);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  React.useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved === "accepted" || saved === "declined") {
      setConsent(saved);
      setVisible(false);
    } else {
      setVisible(true);
    }

    const onOpenSettings = () => {
      setVisible(true);
    };
    window.addEventListener("webix:open-cookie-settings", onOpenSettings);
    return () =>
      window.removeEventListener("webix:open-cookie-settings", onOpenSettings);
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    setConsent(choice);
    setVisible(false);
  };

  return (
    <>
      {/* Analytics Scripts — strictly gated behind user consent */}
      {consent === "accepted" && gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {consent === "accepted" && clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      ) : null}

      {consent === "accepted" && metaPixelId ? (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}

      {/* Non-blocking Consent Banner */}
      {visible && (
        <aside
          aria-label="Cookie consent"
          className="fixed bottom-20 md:bottom-5 left-3 right-3 md:left-5 md:right-auto md:max-w-[420px] z-50 rounded-md border border-white/15 bg-[#141519]/95 backdrop-blur-md p-4 shadow-2xl text-[#F5F6F8]"
        >
          <p className="font-display text-sm font-semibold text-white">
            Cookies & analytics
          </p>
          <p className="mt-1 text-xs text-[#A7ACB8] leading-relaxed">
            We use essential cookies to keep this site working and optional
            analytics (GA4, Clarity, Meta Pixel) to improve our pages. Optional
            scripts load only if you accept. Read our{" "}
            <Link
              href="/cookie-policy/"
              className="text-white underline underline-offset-2 hover:text-[#ED1C24]"
            >
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-3.5 flex items-center gap-2.5">
            <Button
              type="button"
              variant="primary"
              size="sm"
              showArrow={false}
              onClick={() => handleChoice("accepted")}
              className="h-9 px-4 text-xs"
            >
              Accept analytics
            </Button>
            <button
              type="button"
              onClick={() => handleChoice("declined")}
              className="inline-flex h-9 items-center justify-center rounded-md border border-white/15 bg-[#1C1E24] px-3.5 text-xs font-medium text-[#A7ACB8] hover:text-white transition-colors"
            >
              Essential only
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
