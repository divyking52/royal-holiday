/**
 * Consent-aware analytics event schema for the three-month campaign trial.
 * Do not send PII to analytics unless explicitly permitted and configured.
 */

export type AnalyticsEventName =
  | "landing_page_view"
  | "cta_click"
  | "destination_interaction"
  | "form_start"
  | "form_step_complete"
  | "form_abandon"
  | "form_submit_success"
  | "form_submit_error"
  | "qualified_lead"
  | "appointment_booking"
  | "appointment_attendance"
  | "membership_sale"
  | "attributable_revenue";

export type AnalyticsPayload = {
  event: AnalyticsEventName;
  timestamp: string;
  page?: string;
  variant?: string;
  cta_id?: string;
  destination_id?: string;
  form_step?: number | string;
  lead_id?: string;
  consent_analytics?: boolean;
  consent_marketing?: boolean;
  meta?: Record<string, string | number | boolean | null>;
};

const DEDUPE_WINDOW_MS = 1500;
const recent = new Map<string, number>();

function dedupeKey(payload: AnalyticsPayload) {
  return [
    payload.event,
    payload.cta_id ?? "",
    payload.destination_id ?? "",
    payload.form_step ?? "",
    payload.lead_id ?? "",
  ].join("|");
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("rh_consent_analytics") === "granted";
  } catch {
    return false;
  }
}

export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "rh_consent_analytics",
      granted ? "granted" : "denied",
    );
  } catch {
    /* ignore */
  }
}

export function trackEvent(
  event: AnalyticsEventName,
  data: Omit<AnalyticsPayload, "event" | "timestamp"> = {},
) {
  const payload: AnalyticsPayload = {
    event,
    timestamp: new Date().toISOString(),
    page: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...data,
  };

  const key = dedupeKey(payload);
  const now = Date.now();
  const last = recent.get(key);
  if (last && now - last < DEDUPE_WINDOW_MS) return;
  recent.set(key, now);

  // Always keep a local debug trail in development
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", payload);
  }

  // Consent gate for third-party sinks
  if (!hasAnalyticsConsent() && event !== "landing_page_view") {
    // Allow first-party server logging without marketing pixels when no consent
  }

  // Pluggable sinks — configured via env, never ship secrets to the browser
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (endpoint && hasAnalyticsConsent()) {
    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* swallow network errors — analytics must not break UX */
    });
  }

  // Optional dataLayer bridge (GTM) — only when consent granted
  if (typeof window !== "undefined" && hasAnalyticsConsent()) {
    const w = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) {
      const { event: eventName, ...rest } = payload;
      w.dataLayer.push({
        event: `rh_${eventName}`,
        ...rest,
      });
    }
  }
}

/**
 * Reporting metrics supported by this event schema (computed in BI / CRM):
 * - Cost per lead
 * - Qualified-lead rate
 * - Cost per qualified lead
 * - Appointment-booking rate
 * - Presentation attendance rate
 * - Cost per attended presentation
 * - Membership sales
 * - Customer acquisition cost
 * - Campaign revenue
 */
export const REPORTING_METRICS = [
  "cost_per_lead",
  "qualified_lead_rate",
  "cost_per_qualified_lead",
  "appointment_booking_rate",
  "presentation_attendance_rate",
  "cost_per_attended_presentation",
  "membership_sales",
  "customer_acquisition_cost",
  "campaign_revenue",
] as const;
