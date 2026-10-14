export type CampaignAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page_variant: string | null;
  landing_path: string | null;
  referrer: string | null;
  captured_at: string;
};

const STORAGE_KEY = "rh_attribution_v1";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function captureAttribution(
  searchParams?: URLSearchParams | null,
  variant = "vacation-club-home",
): CampaignAttribution {
  const params =
    searchParams ??
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null);

  const existing = readAttribution();

  const next: CampaignAttribution = {
    utm_source: params?.get("utm_source") ?? existing?.utm_source ?? null,
    utm_medium: params?.get("utm_medium") ?? existing?.utm_medium ?? null,
    utm_campaign: params?.get("utm_campaign") ?? existing?.utm_campaign ?? null,
    utm_content: params?.get("utm_content") ?? existing?.utm_content ?? null,
    utm_term: params?.get("utm_term") ?? existing?.utm_term ?? null,
    landing_page_variant:
      params?.get("variant") ?? existing?.landing_page_variant ?? variant,
    landing_path:
      typeof window !== "undefined"
        ? window.location.pathname
        : (existing?.landing_path ?? null),
    referrer:
      typeof document !== "undefined"
        ? document.referrer || existing?.referrer || null
        : (existing?.referrer ?? null),
    captured_at: existing?.captured_at ?? new Date().toISOString(),
  };

  // Prefer first-touch UTMs; only overwrite empty fields when new params exist
  const hasNewUtm = UTM_KEYS.some((k) => params?.get(k));
  if (hasNewUtm && !existing?.utm_source && !existing?.utm_campaign) {
    next.captured_at = new Date().toISOString();
  }

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
  }

  return next;
}

export function readAttribution(): CampaignAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CampaignAttribution;
  } catch {
    return null;
  }
}
