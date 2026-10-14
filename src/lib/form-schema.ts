import { z } from "zod";

export const travelPreferencesSchema = z.object({
  preferredDestinations: z
    .array(z.string().min(1))
    .min(1, "Select at least one destination interest"),
  vacationFrequency: z.enum(
    ["1", "2-3", "4+", "rarely"],
    { message: "Select how often you typically vacation" },
  ),
  travelers: z.enum(["1", "2", "3-4", "5+"], {
    message: "Select number of travelers",
  }),
  timeshareStatus: z.enum(
    ["none", "current", "previous", "prefer_not"],
    { message: "Select your timeshare ownership status" },
  ),
  budgetRange: z.enum(
    ["under_10k", "10k_25k", "25k_50k", "50k_plus", "unsure"],
    { message: "Select an approximate budget range" },
  ),
  purchaseTimeline: z.enum(
    ["asap", "1_3_months", "3_6_months", "exploring"],
    { message: "Select your timeline" },
  ),
});

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(200),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(30)
    .regex(/^[+\d()\-\s.]+$/, "Enter a valid phone number"),
  location: z
    .string()
    .trim()
    .min(2, "Enter your U.S. state or city")
    .max(120),
  preferredContactMethod: z.enum(["phone", "email", "whatsapp", "sms"], {
    message: "Select a preferred contact method",
  }),
  preferredContactTime: z.enum(
    ["morning", "afternoon", "evening", "anytime"],
    { message: "Select a preferred contact time" },
  ),
  decisionMakersCanAttend: z.enum(["yes", "no", "unsure"], {
    message: "Please answer whether decision-makers can attend",
  }),
});

export const consentSchema = z
  .object({
    privacyAcknowledged: z.literal(true, {
      message: "You must acknowledge the privacy notice to continue",
    }),
    contactConsent: z.literal(true, {
      message: "Consent to be contacted about this inquiry is required",
    }),
    marketingEmail: z.boolean().default(false),
    marketingSms: z.boolean().default(false),
    marketingPhone: z.boolean().default(false),
  });

export const qualificationSchema = travelPreferencesSchema
  .merge(contactSchema)
  .merge(consentSchema);

export type TravelPreferences = z.infer<typeof travelPreferencesSchema>;
export type ContactInfo = z.infer<typeof contactSchema>;
export type ConsentInfo = z.infer<typeof consentSchema>;
export type QualificationPayload = z.infer<typeof qualificationSchema>;

export const destinationOptions = [
  { value: "cancun", label: "Cancún" },
  { value: "los-cabos", label: "Los Cabos" },
  { value: "puerto-vallarta", label: "Puerto Vallarta" },
  { value: "orlando", label: "Orlando" },
  { value: "miami", label: "Miami Beach" },
  { value: "caribbean", label: "Caribbean" },
  { value: "europe", label: "Europe" },
  { value: "other", label: "Other / not sure yet" },
] as const;

export const frequencyOptions = [
  { value: "1", label: "About once a year" },
  { value: "2-3", label: "2–3 times a year" },
  { value: "4+", label: "4 or more times a year" },
  { value: "rarely", label: "Less than once a year" },
] as const;

export const travelerOptions = [
  { value: "1", label: "1 traveler" },
  { value: "2", label: "2 travelers" },
  { value: "3-4", label: "3–4 travelers" },
  { value: "5+", label: "5 or more" },
] as const;

export const timeshareOptions = [
  { value: "none", label: "I do not own a timeshare" },
  { value: "current", label: "I currently own a timeshare" },
  { value: "previous", label: "I previously owned a timeshare" },
  { value: "prefer_not", label: "Prefer not to say" },
] as const;

export const budgetOptions = [
  { value: "under_10k", label: "Under $10,000" },
  { value: "10k_25k", label: "$10,000 – $25,000" },
  { value: "25k_50k", label: "$25,000 – $50,000" },
  { value: "50k_plus", label: "$50,000+" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1_3_months", label: "Within 1–3 months" },
  { value: "3_6_months", label: "Within 3–6 months" },
  { value: "exploring", label: "Just exploring options" },
] as const;
