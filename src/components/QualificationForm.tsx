"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import {
  budgetOptions,
  consentSchema,
  contactSchema,
  destinationOptions,
  frequencyOptions,
  timelineOptions,
  timeshareOptions,
  travelerOptions,
  travelPreferencesSchema,
  type ConsentInfo,
  type ContactInfo,
  type TravelPreferences,
} from "@/lib/form-schema";
import { formCopy, siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type FormState = TravelPreferences & ContactInfo & ConsentInfo;

const initialState: FormState = {
  preferredDestinations: [],
  vacationFrequency: undefined as unknown as TravelPreferences["vacationFrequency"],
  travelers: undefined as unknown as TravelPreferences["travelers"],
  timeshareStatus: undefined as unknown as TravelPreferences["timeshareStatus"],
  budgetRange: undefined as unknown as TravelPreferences["budgetRange"],
  purchaseTimeline: undefined as unknown as TravelPreferences["purchaseTimeline"],
  fullName: "",
  email: "",
  phone: "",
  location: "",
  preferredContactMethod:
    undefined as unknown as ContactInfo["preferredContactMethod"],
  preferredContactTime:
    undefined as unknown as ContactInfo["preferredContactTime"],
  decisionMakersCanAttend:
    undefined as unknown as ContactInfo["decisionMakersCanAttend"],
  privacyAcknowledged: undefined as unknown as true,
  contactConsent: undefined as unknown as true,
  marketingEmail: false,
  marketingSms: false,
  marketingPhone: false,
};

type SubmitResult = {
  ok: boolean;
  leadId?: string;
  appointmentAvailable?: boolean;
  appointmentUrl?: string | null;
  message?: string;
  code?: string;
};

export function QualificationForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const started = useRef(false);
  const formRef = useRef<HTMLElement>(null);
  useScrollReveal(formRef, { selector: "[data-form-reveal]", y: 32, stagger: 0.08 });

  const markStart = useCallback(() => {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start");
  }, []);

  useEffect(() => {
    const onLeave = () => {
      if (started.current && status === "idle") {
        trackEvent("form_abandon", { form_step: step + 1 });
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [step, status]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    markStart();
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const toggleDestination = (value: string) => {
    markStart();
    setData((d) => {
      const set = new Set(d.preferredDestinations);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...d, preferredDestinations: Array.from(set) };
    });
    setErrors((e) => {
      const next = { ...e };
      delete next.preferredDestinations;
      return next;
    });
  };

  const validateStep = () => {
    if (step === 0) {
      const parsed = travelPreferencesSchema.safeParse(data);
      if (!parsed.success) {
        const map: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          const k = String(i.path[0]);
          if (!map[k]) map[k] = i.message;
        });
        setErrors(map);
        return false;
      }
    }
    if (step === 1) {
      const parsed = contactSchema.safeParse(data);
      if (!parsed.success) {
        const map: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          const k = String(i.path[0]);
          if (!map[k]) map[k] = i.message;
        });
        setErrors(map);
        return false;
      }
    }
    if (step === 2) {
      const parsed = consentSchema.safeParse({
        privacyAcknowledged: data.privacyAcknowledged === true ? true : undefined,
        contactConsent: data.contactConsent === true ? true : undefined,
        marketingEmail: data.marketingEmail,
        marketingSms: data.marketingSms,
        marketingPhone: data.marketingPhone,
      });
      if (!parsed.success) {
        const map: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          const k = String(i.path[0]);
          if (!map[k]) map[k] = i.message;
        });
        setErrors(map);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    trackEvent("form_step_complete", { form_step: step + 1 });
    setStep((s) => Math.min(s + 1, 2));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          companyWebsite: honeypot,
          attribution: readAttribution(),
        }),
      });
      const json = (await res.json()) as SubmitResult;

      if (!res.ok || !json.ok) {
        setStatus("error");
        setResult(json);
        trackEvent("form_submit_error", {
          meta: { code: json.code ?? "unknown" },
        });
        return;
      }

      setStatus("success");
      setResult(json);
      trackEvent("form_submit_success", { lead_id: json.leadId });
      trackEvent("qualified_lead", { lead_id: json.leadId });
    } catch {
      setStatus("error");
      setResult({
        ok: false,
        message: formCopy.errorGeneric,
        code: "NETWORK",
      });
      trackEvent("form_submit_error", { meta: { code: "network" } });
    }
  };

  return (
    <section
      ref={formRef}
      id="qualify"
      className="section-pad scroll-mt-24 bg-ivory"
      aria-labelledby="qualify-heading"
    >
      <div
        data-form-reveal
        className="container-rh max-w-3xl card-soft shadow-sm px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12"
      >
        <header className="mb-7 sm:mb-10 text-center">
          <span className="tag-pill">Qualification</span>
          <h2
            id="qualify-heading"
            className="mt-4 sm:mt-5 font-display text-[1.65rem] sm:text-3xl md:text-5xl text-ink text-balance"
          >
            {formCopy.title}
          </h2>
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-ink-soft leading-relaxed max-w-lg mx-auto">
            {formCopy.subtitle}
          </p>
        </header>

        {status === "success" && result?.ok ? (
          <SuccessPanel result={result} />
        ) : (
          <>
            <div className="mb-8" aria-hidden={false}>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {formCopy.steps.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      "min-w-0 text-center leading-tight",
                      i === step
                        ? "text-ocean font-medium"
                        : "text-ink-soft",
                    )}
                  >
                    <span className="block text-[10px] uppercase tracking-[0.14em] sm:hidden">
                      {i + 1}. {s.shortLabel}
                    </span>
                    <span className="hidden sm:block text-xs uppercase tracking-[0.14em]">
                      {i + 1}. {s.label}
                    </span>
                    <span
                      className={cn(
                        "mt-2 block h-px w-full",
                        i === step
                          ? "bg-ocean"
                          : i < step
                            ? "bg-ocean/35"
                            : "bg-sand-deep",
                      )}
                      aria-hidden
                    />
                  </span>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 0 ? (
                  <StepPreferences
                    data={data}
                    errors={errors}
                    onToggleDestination={toggleDestination}
                    onUpdate={update}
                  />
                ) : null}
                {step === 1 ? (
                  <StepContact data={data} errors={errors} onUpdate={update} />
                ) : null}
                {step === 2 ? (
                  <StepConsent
                    data={data}
                    errors={errors}
                    onUpdate={update}
                    honeypot={honeypot}
                    setHoneypot={setHoneypot}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>

            {status === "error" ? (
              <div
                role="alert"
                className="mt-6 border border-error/30 bg-error/5 text-error px-4 py-3 text-sm"
              >
                {result?.message ?? formCopy.errorGeneric}
                {result?.code === "NOT_CONFIGURED" ? (
                  <span className="block mt-1 text-ink-soft">
                    Integration pending: CRM credentials are not configured in
                    this environment.
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="mt-10 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={back}
                disabled={step === 0 || status === "loading"}
                className={cn(step === 0 && "invisible")}
              >
                <ArrowLeft size={16} aria-hidden />
                Back
              </Button>

              {step < 2 ? (
                <Button type="button" variant="primary" size="lg" magnetic onClick={next}>
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  magnetic
                  onClick={submit}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="animate-spin" size={16} aria-hidden />
                      Submitting…
                    </>
                  ) : (
                    "Submit inquiry"
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function SuccessPanel({ result }: { result: SubmitResult }) {
  return (
    <div className="rounded-[1.75rem] border border-teal/20 bg-lavender/40 p-8 md:p-10" role="status">
      <CheckCircle2 className="text-success mb-4" size={36} aria-hidden />
      <h3 className="font-display text-3xl text-ink">{formCopy.successTitle}</h3>
      <p className="mt-3 text-ink-soft leading-relaxed">{formCopy.successBody}</p>
      {result.leadId ? (
        <p className="mt-4 text-sm text-ink-soft">
          Reference: <span className="font-medium text-ink">{result.leadId}</span>
        </p>
      ) : null}
      {result.appointmentAvailable && result.appointmentUrl ? (
        <div className="mt-6">
          <Button href={result.appointmentUrl} variant="primary" size="lg">
            View appointment availability
          </Button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-soft border-l-2 border-gold/50 pl-4">
          Appointment scheduling is not connected in this environment. A
          specialist will follow up using your preferred contact method.
        </p>
      )}
      <p className="mt-6 text-sm text-ink-soft">
        Prefer to call?{" "}
        <a href={siteConfig.phoneHref} className="text-ocean underline-offset-2 hover:underline">
          {siteConfig.phoneDisplay}
        </a>
      </p>
    </div>
  );
}

type FieldProps = {
  data: FormState;
  errors: Record<string, string>;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-error" role="alert">
      {message}
    </p>
  );
}

function StepPreferences({
  data,
  errors,
  onUpdate,
  onToggleDestination,
}: FieldProps & { onToggleDestination: (v: string) => void }) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-sm font-medium text-ink mb-3">
          Preferred destinations
        </legend>
        <div className="flex flex-wrap gap-2">
          {destinationOptions.map((opt) => {
            const selected = data.preferredDestinations.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                data-hover-lift
                aria-pressed={selected}
                onClick={() => onToggleDestination(opt.value)}
                className={cn(
                  "px-3.5 py-2 text-[13px] sm:text-sm sm:px-4 border will-change-transform whitespace-nowrap",
                  selected
                    ? "border-ocean bg-ocean text-white rounded-full"
                    : "border-sand-deep text-ink rounded-full",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <FieldError message={errors.preferredDestinations} />
      </fieldset>

      <SelectField
        label="Typical annual vacation frequency"
        name="vacationFrequency"
        value={data.vacationFrequency}
        error={errors.vacationFrequency}
        options={frequencyOptions}
        onChange={(v) =>
          onUpdate("vacationFrequency", v as TravelPreferences["vacationFrequency"])
        }
      />
      <SelectField
        label="Number of travelers"
        name="travelers"
        value={data.travelers}
        error={errors.travelers}
        options={travelerOptions}
        onChange={(v) => onUpdate("travelers", v as TravelPreferences["travelers"])}
      />
      <SelectField
        label="Current timeshare ownership status"
        name="timeshareStatus"
        value={data.timeshareStatus}
        error={errors.timeshareStatus}
        options={timeshareOptions}
        onChange={(v) =>
          onUpdate("timeshareStatus", v as TravelPreferences["timeshareStatus"])
        }
      />
      <SelectField
        label="Approximate membership or travel budget"
        name="budgetRange"
        value={data.budgetRange}
        error={errors.budgetRange}
        options={budgetOptions}
        onChange={(v) =>
          onUpdate("budgetRange", v as TravelPreferences["budgetRange"])
        }
      />
      <SelectField
        label="Purchase timeline"
        name="purchaseTimeline"
        value={data.purchaseTimeline}
        error={errors.purchaseTimeline}
        options={timelineOptions}
        onChange={(v) =>
          onUpdate("purchaseTimeline", v as TravelPreferences["purchaseTimeline"])
        }
      />
    </div>
  );
}

function StepContact({ data, errors, onUpdate }: FieldProps) {
  return (
    <div className="space-y-6">
      <TextField
        label="Full name"
        name="fullName"
        autoComplete="name"
        value={data.fullName}
        error={errors.fullName}
        onChange={(v) => onUpdate("fullName", v)}
      />
      <TextField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={data.email}
        error={errors.email}
        onChange={(v) => onUpdate("email", v)}
      />
      <TextField
        label="Phone or WhatsApp number"
        name="phone"
        type="tel"
        autoComplete="tel"
        value={data.phone}
        error={errors.phone}
        onChange={(v) => onUpdate("phone", v)}
      />
      <TextField
        label="U.S. state or city"
        name="location"
        autoComplete="address-level1"
        value={data.location}
        error={errors.location}
        onChange={(v) => onUpdate("location", v)}
      />
      <SelectField
        label="Preferred contact method"
        name="preferredContactMethod"
        value={data.preferredContactMethod}
        error={errors.preferredContactMethod}
        options={[
          { value: "phone", label: "Phone call" },
          { value: "email", label: "Email" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "sms", label: "SMS" },
        ]}
        onChange={(v) =>
          onUpdate(
            "preferredContactMethod",
            v as ContactInfo["preferredContactMethod"],
          )
        }
      />
      <SelectField
        label="Preferred contact time"
        name="preferredContactTime"
        value={data.preferredContactTime}
        error={errors.preferredContactTime}
        options={[
          { value: "morning", label: "Morning" },
          { value: "afternoon", label: "Afternoon" },
          { value: "evening", label: "Evening" },
          { value: "anytime", label: "Anytime" },
        ]}
        onChange={(v) =>
          onUpdate(
            "preferredContactTime",
            v as ContactInfo["preferredContactTime"],
          )
        }
      />
      <SelectField
        label="Can all relevant decision-makers attend a presentation?"
        name="decisionMakersCanAttend"
        value={data.decisionMakersCanAttend}
        error={errors.decisionMakersCanAttend}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "unsure", label: "Not sure yet" },
        ]}
        onChange={(v) =>
          onUpdate(
            "decisionMakersCanAttend",
            v as ContactInfo["decisionMakersCanAttend"],
          )
        }
      />
    </div>
  );
}

function StepConsent({
  data,
  errors,
  onUpdate,
  honeypot,
  setHoneypot,
}: FieldProps & {
  honeypot: string;
  setHoneypot: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-soft leading-relaxed border-l-2 border-sand-deep pl-4">
        {formCopy.privacyNotice}
      </p>

      {/* Honeypot — hidden from users */}
      <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden>
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <Checkbox
        id="privacyAcknowledged"
        checked={data.privacyAcknowledged === true}
        error={errors.privacyAcknowledged}
        onChange={(v) =>
          onUpdate("privacyAcknowledged", (v ? true : undefined) as true)
        }
        label={
          <>
            I have read and understand the{" "}
            <a
              href={siteConfig.urls.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean underline-offset-2 hover:underline"
            >
              privacy notice
            </a>
            .
          </>
        }
      />

      <Checkbox
        id="contactConsent"
        checked={data.contactConsent === true}
        error={errors.contactConsent}
        onChange={(v) =>
          onUpdate("contactConsent", (v ? true : undefined) as true)
        }
        label="I consent to be contacted about this vacation-club membership inquiry using the details I provided."
      />

      <fieldset className="pt-2">
        <legend className="text-sm font-medium text-ink mb-2">
          Optional marketing preferences
        </legend>
        <p className="text-sm text-ink-soft mb-4">
          Marketing consent is optional and is not required to submit a general
          inquiry.
        </p>
        <div className="space-y-3">
          <Checkbox
            id="marketingEmail"
            checked={data.marketingEmail}
            onChange={(v) => onUpdate("marketingEmail", v)}
            label="Email me relevant membership and travel information"
          />
          <Checkbox
            id="marketingSms"
            checked={data.marketingSms}
            onChange={(v) => onUpdate("marketingSms", v)}
            label="Send me SMS updates (message & data rates may apply)"
          />
          <Checkbox
            id="marketingPhone"
            checked={data.marketingPhone}
            onChange={(v) => onUpdate("marketingPhone", v)}
            label="Call me about future offers beyond this inquiry"
          />
        </div>
      </fieldset>
    </div>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "w-full rounded-2xl border bg-mist/50 px-4 py-3 text-ink outline-none transition-colors focus:border-ocean focus:bg-sand",
          error ? "border-error" : "border-sand-deep",
        )}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  name: string;
  value?: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-2xl border bg-mist/50 px-4 py-3 text-ink outline-none transition-colors focus:border-ocean focus:bg-sand",
          error ? "border-error" : "border-sand-deep",
        )}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

function Checkbox({
  id,
  checked,
  onChange,
  label,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex gap-3 items-start cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 accent-ocean"
          aria-invalid={Boolean(error)}
        />
        <span className="text-sm text-ink leading-relaxed">{label}</span>
      </label>
      <FieldError message={error} />
    </div>
  );
}
