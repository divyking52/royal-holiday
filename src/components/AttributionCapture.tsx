"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
    trackEvent("landing_page_view", { variant: "vacation-club-home" });
  }, []);

  return null;
}
