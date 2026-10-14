/**
 * Site content — keep copy data-driven so approved RH content can replace placeholders.
 * Items marked [PENDING APPROVAL] require Royal Holiday team confirmation before launch.
 */

export const siteConfig = {
  name: "Royal Holiday",
  legalName: "Holiday Club Management Company de México, S.A. de C.V.",
  tagline: "Vacation-club membership for travelers who want more from every getaway.",
  phone: "1-855-307-6925",
  phoneDisplay: "1 855 30 ROYAL (76925)",
  phoneHref: "tel:+18553076925",
  email: "[PENDING APPROVAL: official U.S. inquiry email]",
  website: "https://www.royal-holiday.com",
  locales: ["en-US"] as const,
  locale: "en-US",
  urls: {
    privacy: "https://www.royal-holiday.com/en/privacy-policy",
    terms: "[PENDING APPROVAL: membership terms URL]",
    cookies: "https://www.royal-holiday.com",
    membership: "https://prgtm.royal-holiday.com/en/mx/get-to-know/membership",
    destinations: "https://www.royal-holiday.com/en/destinations",
    about: "https://prgtm.royal-holiday.com/en/mx/about-royal-holiday",
  },
  social: {
    facebook: "[PENDING APPROVAL]",
    instagram: "[PENDING APPROVAL]",
    youtube: "[PENDING APPROVAL]",
  },
  established: "1992",
  establishedNote:
    "Royal Holiday was established in Geneva, Switzerland in 1992. [PENDING APPROVAL: confirm current official about-copy for U.S. campaigns]",
} as const;

export const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "How it works", href: "#membership" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
] as const;

export const heroContent = {
  badge: "Vacation club · Est. 1992",
  headline: "Quiet the Noise.",
  headlineEmphasis: "part of your life",
  headlineRest: "Make the world",
  supporting:
    "A haven for travelers seeking clarity on vacation-club membership — destinations, Holiday Credits, and options that fit how you travel.",
  primaryCta: {
    label: "Explore Vacation Ownership",
    href: "#membership",
  },
  secondaryCta: {
    label: "Speak With a Vacation Specialist",
    href: "#qualify",
  },
  scrollLabel: "Scroll to explore",
  /** Vertical cards for the inward cylindrical hero grid */
  cylinderImages: [
    {
      id: "c1",
      src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
      alt: "Resort infinity pool — placeholder",
    },
    {
      id: "c2",
      src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      alt: "Luxury pool overlooking the sea — placeholder",
    },
    {
      id: "c3",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      alt: "Tropical beach shoreline — placeholder",
    },
    {
      id: "c4",
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      alt: "Resort exterior architecture — placeholder",
    },
    {
      id: "c5",
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      alt: "Resort pool lounge — placeholder",
    },
    {
      id: "c6",
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
      alt: "Caribbean coastline resort — placeholder",
    },
    {
      id: "c7",
      src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
      alt: "Bright suite with ocean view — placeholder",
    },
    {
      id: "c8",
      src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
      alt: "Scenic getaway landscape — placeholder",
    },
    {
      id: "c9",
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
      alt: "Resort dining ambiance — placeholder",
    },
    {
      id: "c10",
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      alt: "Spa wellness space — placeholder",
    },
    {
      id: "c11",
      src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      alt: "Clear tropical water — placeholder",
    },
  ],
} as const;

export const philosophyContent = {
  tag: "Our philosophy",
  headlineBefore: "Membership is not a destination — it's a",
  headlineEm: "practice",
  headlineAfter: "of travel.",
  body: "Royal Holiday uses Holiday Credits so you can plan getaways across participating destinations — subject to availability, membership terms, and reservation rules.",
  cta: { label: "Explore Vacation Ownership", href: "#membership" },
  image:
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80",
  imageAlt:
    "Luxury resort pool overlooking the sea — placeholder photography",
  note: "*Availability and inventory vary by membership and destination.",
} as const;

export const destinationsSection = {
  headline: "Your next escape starts here.",
  supporting:
    "Explore participating destinations associated with Royal Holiday vacations. Availability, seasons, and reservation rules vary by membership and destination.",
  note: "Destination details below reference publicly listed Park Royal Hotels & Resorts properties and popular membership travel regions. Replace imagery with official approved photography before launch.",
} as const;

/**
 * Verified destination regions / Park Royal properties from public RCI / RH materials.
 * Do not invent amenities or guarantees.
 */
export const destinations = [
  {
    id: "cancun",
    name: "Cancún",
    region: "Quintana Roo, Mexico",
    property: "Grand Park Royal Cancún",
    blurb:
      "Caribbean coastline stays associated with Park Royal Hotels & Resorts in Cancún.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Tropical turquoise coastline with resort shoreline — placeholder photography pending official assets",
  },
  {
    id: "cozumel",
    name: "Cozumel",
    region: "Quintana Roo, Mexico",
    property: "Grand Park Royal Cozumel",
    blurb: "Island destination listed among Park Royal Hotels & Resorts properties.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Clear Caribbean water near a tropical island — placeholder photography",
  },
  {
    id: "puerto-vallarta",
    name: "Puerto Vallarta",
    region: "Jalisco, Mexico",
    property: "Grand Park Royal Puerto Vallarta",
    blurb: "Pacific coast destination listed among Park Royal Hotels & Resorts properties.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Bay view with mountains and shoreline — placeholder photography",
  },
  {
    id: "los-cabos",
    name: "Los Cabos",
    region: "Baja California Sur, Mexico",
    property: "Park Royal Homestay Los Cabos",
    blurb: "Sea of Cortez destination listed among Park Royal Hotels & Resorts properties.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Desert coastline meeting ocean — placeholder photography",
  },
  {
    id: "acapulco",
    name: "Acapulco",
    region: "Guerrero, Mexico",
    property: "Park Royal Beach Acapulco",
    blurb: "Pacific resort destination listed among Park Royal Hotels & Resorts properties.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Golden sand beach and ocean waves — placeholder photography",
  },
  {
    id: "miami",
    name: "Miami Beach",
    region: "Florida, United States",
    property: "Park Royal Miami Beach",
    blurb: "U.S. destination listed among Park Royal Hotels & Resorts properties.",
    image:
      "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Miami Beach coastline at dusk — placeholder photography",
  },
  {
    id: "orlando",
    name: "Orlando",
    region: "Florida, United States",
    property: "Park Royal Orlando",
    blurb: "Central Florida destination listed among Park Royal Hotels & Resorts properties.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Palm-lined resort pool area — placeholder photography",
  },
  {
    id: "punta-cana",
    name: "Punta Cana",
    region: "Dominican Republic",
    property: "Caribbean destination network",
    blurb:
      "The Dominican Republic, especially Punta Cana, is frequently cited among popular Caribbean options for members. Confirm participating properties for U.S. campaigns before launch.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Palm trees over white sand beach — placeholder photography",
  },
] as const;

export const membershipSteps = {
  headline: "A different way to think about your vacations.",
  supporting:
    "Royal Holiday membership is a vacation-club model based on Holiday Credits rather than a single fixed week at one resort. Exact terms, fees, and benefits depend on the membership option presented to you.",
  steps: [
    {
      number: "01",
      title: "Explore membership options",
      body: "Learn how vacation-club membership can fit the way you travel — destinations, trip frequency, and travel party size.",
    },
    {
      number: "02",
      title: "Understand destinations, reservations, and benefits",
      body: "Review how Holiday Credits, reservation windows, participating destinations, and member services work before making any decision.",
    },
    {
      number: "03",
      title: "Speak with a vacation specialist",
      body: "Discuss available options, costs, restrictions, and terms with a specialist. Attendance at a vacation ownership presentation may be part of the process.",
    },
  ],
  disclaimer:
    "Membership terms vary. This page does not guarantee availability, savings, unlimited travel, or specific benefits. Request current terms from Royal Holiday before purchasing.",
} as const;

export const benefitsSection = {
  headline: "More possibilities for your next getaway.",
  supporting:
    "The following themes reflect publicly described membership concepts. Confirm each benefit, restriction, and fee with Royal Holiday before publishing campaign claims.",
  items: [
    {
      id: "destinations-access",
      title: "Access to participating destinations",
      body: "Membership is designed to provide access to participating hotels, affiliated resorts, and related vacation options across multiple destinations. Networks and inventory can change.",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
      imageAlt: "Luxury resort exterior overlooking water — placeholder photography",
      icon: "MapPinned",
    },
    {
      id: "planning",
      title: "Vacation planning flexibility",
      body: "Holiday Credits are used to reserve stays based on destination, season, resort type, length of stay, and room size. Credits and availability depend on your membership level.",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
      imageAlt: "Travel planning materials on a desk — placeholder photography",
      icon: "CalendarRange",
    },
    {
      id: "experiences",
      title: "Accommodation experiences",
      body: "Options may include hotels, affiliated resorts, villas, condominiums, and in some cases cruise experiences — subject to membership terms and availability.",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80",
      imageAlt: "Stylish hotel suite interior — placeholder photography",
      icon: "Building2",
    },
    {
      id: "services",
      title: "Member services & reservation support",
      body: "Vacation specialists and member services can help you understand options and plan reservations. Service levels and channels should be confirmed for U.S. prospects.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      imageAlt: "Resort pool and lounge area — placeholder photography",
      icon: "Headset",
    },
  ],
  learnMoreHref: "#qualify",
  learnMoreLabel: "Learn more about membership",
  restrictionsNote:
    "Reservations are subject to availability, membership rules, applicable fees, blackout periods, and exchange-network terms where applicable. [PENDING APPROVAL: publish official fee schedule and reservation rules for U.S. visitors]",
} as const;

export const experienceGallery = {
  headline: "Moments that feel like travel should.",
  supporting:
    "A photography-led look at the atmosphere of resort vacations. Replace with official Royal Holiday / Park Royal approved imagery before launch.",
  images: [
    {
      id: "pool",
      src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
      alt: "Resort infinity pool overlooking the ocean — placeholder",
      caption: "Poolside leisure",
    },
    {
      id: "suite",
      src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
      alt: "Bright hotel bedroom with ocean view — placeholder",
      caption: "Suite comfort",
    },
    {
      id: "dining",
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
      alt: "Fine dining table setting — placeholder",
      caption: "Dining experiences",
    },
    {
      id: "beach",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      alt: "Lounge chairs on a sandy beach — placeholder",
      caption: "Beach days",
    },
    {
      id: "spa",
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
      alt: "Spa treatment room ambiance — placeholder",
      caption: "Wellness spaces",
    },
    {
      id: "sunset",
      src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
      alt: "Lake and mountain landscape at golden hour — placeholder",
      caption: "Scenic escapes",
    },
  ],
} as const;

export const trustSection = {
  headline: "Confidence starts with clarity.",
  supporting:
    "We believe membership decisions deserve clear information — not pressure or unverified claims.",
  companyBackground: {
    title: "About Royal Holiday",
    body: "Royal Holiday is a vacation club offering membership-based access to participating destinations and vacation experiences. Public materials describe an organization established in 1992 with Holiday Credits as the core reservation mechanism. Confirm all company statistics, member counts, and credential claims with the Royal Holiday team before advertising them.",
  },
  testimonialsStatus: "pending_approval" as const,
  testimonialsPlaceholder:
    "Approved member testimonials have not been supplied. Do not publish fabricated names, photos, ratings, or quotations. Drop approved stories into content/testimonials once cleared for U.S. use.",
  credentials: [
    {
      label: "Official website",
      value: "royal-holiday.com",
      href: "https://www.royal-holiday.com",
    },
    {
      label: "U.S. phone (public listing)",
      value: "1 855 30 ROYAL (76925)",
      href: "tel:+18553076925",
    },
    {
      label: "Membership overview",
      value: "View public membership page",
      href: "https://prgtm.royal-holiday.com/en/mx/get-to-know/membership",
    },
  ],
} as const;

export const faqItems = [
  {
    id: "what-is",
    question: "What is vacation-club membership?",
    answer:
      "Vacation-club membership is typically a points- or credits-based way to reserve stays across participating destinations, rather than owning a fixed week at a single resort. Royal Holiday publicly describes a Holiday Credits model. Exact rights and obligations depend on the membership contract presented to you.",
  },
  {
    id: "how-works",
    question: "How does Royal Holiday membership work?",
    answer:
      "Public materials describe depositing Holiday Credits that can be used based on destination, season, resort type, length of stay, and room size. Availability is checked at reservation time. [PENDING APPROVAL: publish the official U.S. explanation of membership levels, annual fees, and credit allotments.]",
  },
  {
    id: "destinations",
    question: "Which destinations are available?",
    answer:
      "Royal Holiday materials reference access to a broad network of destinations and affiliated properties, including Park Royal Hotels & Resorts locations in Mexico, the United States, Puerto Rico, and Argentina, plus additional affiliated options. Inventory changes; ask a specialist for current participating destinations for your membership type.",
  },
  {
    id: "reservations",
    question: "How do reservations work?",
    answer:
      "Members typically select destination and travel dates, review availability and required credits, then book subject to membership rules. Exchange networks such as RCI may apply for additional options where affiliated. [PENDING APPROVAL: confirm reservation windows, advance booking rules, and cancellation policies for U.S. prospects.]",
  },
  {
    id: "costs",
    question: "What costs and fees should I understand?",
    answer:
      "Membership purchases generally involve an initial cost and may include ongoing maintenance or membership fees, reservation-related charges, and other terms disclosed in your contract. This website does not list pricing because fees must be confirmed by Royal Holiday for the option you are offered. Never rely on unverified savings claims.",
  },
  {
    id: "restrictions",
    question: "Are there membership restrictions?",
    answer:
      "Yes. Expect rules around credit usage, peak seasons, unit size, destination availability, guest policies, and transfer or resale limitations. Review the full membership agreement and disclosure documents before purchasing.",
  },
  {
    id: "presentation",
    question: "What happens during a vacation ownership presentation?",
    answer:
      "A vacation ownership presentation is a scheduled meeting with a specialist to review membership options, destinations, costs, terms, and whether the product fits your travel habits. Attendance does not obligate you to purchase. [PENDING APPROVAL: confirm typical duration, format, and any promotional conditions for U.S. visitors.]",
  },
  {
    id: "speak",
    question: "How can I speak with a vacation specialist?",
    answer:
      `Use the qualification form on this page, or call ${siteConfig.phoneDisplay}. A team member can discuss next steps, including whether a presentation is appropriate. Submitting a form does not guarantee membership, a discount, or an appointment.`,
  },
] as const;

export const conversionSection = {
  headline: "Your next vacation story starts with a conversation.",
  supporting:
    "Explore vacation-club membership and discover whether Royal Holiday is right for the way you travel.",
  primaryCta: { label: "Speak With a Vacation Specialist", href: "#qualify" },
  secondaryCta: { label: "Explore Vacation Ownership", href: "#membership" },
  afterSubmit:
    "After you submit, our team reviews your preferences and may contact you using the method you selected. Submitting does not guarantee membership, pricing, or an appointment.",
} as const;

export const formCopy = {
  title: "Tell us how you like to travel",
  subtitle:
    "A short guided conversation helps us understand whether vacation-club membership may fit your plans — and how a specialist should follow up.",
  steps: [
    { id: "preferences", label: "Travel preferences", shortLabel: "Preferences" },
    { id: "contact", label: "Contact details", shortLabel: "Contact" },
    { id: "consent", label: "Consent & submit", shortLabel: "Consent" },
  ],
  privacyNotice:
    "We use the information you provide to respond to your inquiry about vacation-club membership, qualify interest, and — where you consent — communicate about relevant offers. See our privacy policy for details. Do not submit medical or health information in this form.",
  successTitle: "Thank you — we received your inquiry",
  successBody:
    "A vacation specialist may contact you using your preferred method. If appointment booking is configured for your campaign, available times will appear here. Otherwise, expect a personal follow-up.",
  errorGeneric:
    "We could not save your inquiry right now. Please try again or call us directly. Your details were not confirmed as submitted.",
} as const;

export const pendingApprovals = [
  "Official brand guidelines, logo SVG/PNG, and color tokens",
  "Approved resort photography (replace Unsplash placeholders)",
  "Approved member testimonials and photos",
  "Confirmed U.S. pricing / fee disclosures (if any may be shown)",
  "Membership terms & conditions URL for U.S. prospects",
  "Official U.S. inquiry email address",
  "Social media profile URLs for footer",
  "CRM endpoint credentials and field mapping",
  "Appointment booking integration (Calendly / internal scheduler)",
  "Analytics measurement IDs with consent configuration",
  "Legal review of marketing consent language for U.S. states",
  "Confirmation of destination list for paid U.S. campaigns",
] as const;
