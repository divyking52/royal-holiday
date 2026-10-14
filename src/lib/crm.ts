import type { CampaignAttribution } from "./attribution";
import type { QualificationPayload } from "./form-schema";

export type CrmLeadResult =
  | {
      ok: true;
      leadId: string;
      appointmentAvailable: boolean;
      appointmentUrl?: string | null;
      message: string;
    }
  | {
      ok: false;
      code:
        | "NOT_CONFIGURED"
        | "VALIDATION_ERROR"
        | "UPSTREAM_ERROR"
        | "RATE_LIMITED";
      message: string;
    };

export type CrmSubmitInput = {
  lead: QualificationPayload;
  attribution: CampaignAttribution | null;
  honeypot?: string;
};

/**
 * Integration interface for the approved CRM / booking stack.
 * Server-side only — credentials live in environment variables.
 */
export async function submitLeadToCrm(
  input: CrmSubmitInput,
): Promise<CrmLeadResult> {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    // Silent success for bots — do not create a real lead
    return {
      ok: true,
      leadId: `blocked_${Date.now()}`,
      appointmentAvailable: false,
      message: "Received.",
    };
  }

  const endpoint = process.env.CRM_WEBHOOK_URL;
  const apiKey = process.env.CRM_API_KEY;

  if (!endpoint || !apiKey) {
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      message:
        "CRM integration is not configured. Set CRM_WEBHOOK_URL and CRM_API_KEY. The lead was not saved.",
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        source: "royal-holiday-vacation-club-lp",
        createdAt: new Date().toISOString(),
        lead: input.lead,
        attribution: input.attribution,
      }),
    });

    if (res.status === 429) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again in a few minutes.",
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        code: "UPSTREAM_ERROR",
        message: "The CRM rejected the submission. Please try again later.",
      };
    }

    const data = (await res.json().catch(() => ({}))) as {
      leadId?: string;
      appointmentUrl?: string;
    };

    const bookingConfigured = Boolean(process.env.BOOKING_SCHEDULER_URL);

    return {
      ok: true,
      leadId: data.leadId ?? `rh_${Date.now()}`,
      appointmentAvailable: bookingConfigured,
      appointmentUrl:
        data.appointmentUrl ?? process.env.BOOKING_SCHEDULER_URL ?? null,
      message: "Lead submitted successfully.",
    };
  } catch {
    return {
      ok: false,
      code: "UPSTREAM_ERROR",
      message: "Unable to reach the CRM. Please try again later.",
    };
  }
}
