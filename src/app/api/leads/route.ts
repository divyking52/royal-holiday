import { NextResponse } from "next/server";
import { qualificationSchema } from "@/lib/form-schema";
import { submitLeadToCrm } from "@/lib/crm";
import type { CampaignAttribution } from "@/lib/attribution";
import { uid } from "@/lib/utils";

export const runtime = "nodejs";

const recentIps = new Map<string, number>();

function rateLimit(ip: string) {
  const now = Date.now();
  const last = recentIps.get(ip) ?? 0;
  if (now - last < 4000) return false;
  recentIps.set(ip, now);
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "Please wait a moment before submitting again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Invalid request body.",
      },
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  const honeypot =
    typeof record.companyWebsite === "string" ? record.companyWebsite : "";
  const attribution =
    (record.attribution as CampaignAttribution | null | undefined) ?? null;

  const parsed = qualificationSchema.safeParse(record);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Please check the form fields and try again.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const result = await submitLeadToCrm({
    lead: parsed.data,
    attribution,
    honeypot,
  });

  if (!result.ok) {
    // When CRM is not configured, still return an honest failure — never fake success
    const status = result.code === "NOT_CONFIGURED" ? 503 : 502;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json({
    ...result,
    leadId: result.leadId || uid("lead"),
  });
}
