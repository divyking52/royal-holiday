"use client";

import { useEffect, useState } from "react";
import { setAnalyticsConsent } from "@/lib/analytics";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";

const KEY = "rh_cookie_decision";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (analytics: boolean) => {
    try {
      localStorage.setItem(KEY, analytics ? "accept" : "essential");
    } catch {
      /* ignore */
    }
    setAnalyticsConsent(analytics);
    setVisible(false);
  };

  if (!visible) {
    return (
      <div id="cookie-preferences" className="sr-only">
        Cookie preferences saved. Clear site data to reset.
      </div>
    );
  }

  return (
    <div
      id="cookie-preferences"
      className="fixed bottom-4 left-4 right-4 z-[80] md:left-auto md:right-6 md:max-w-md rounded-[1.5rem] bg-sand border border-sand-deep p-5 shadow-lg"
      role="dialog"
      aria-label="Cookie preferences"
    >
      <p className="text-sm text-ink leading-relaxed">
        We use essential cookies to run this site. Analytics cookies help us
        measure campaign performance and are optional. See the{" "}
        <a
          href={siteConfig.urls.privacy}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ocean underline-offset-2 hover:underline"
        >
          privacy policy
        </a>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="primary" size="md" onClick={() => decide(true)}>
          Accept analytics
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={() => decide(false)}>
          Essential only
        </Button>
      </div>
    </div>
  );
}
