import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.royal-holiday.com",
  ),
  title: {
    default: "Royal Holiday | Vacation-Club Membership",
    template: "%s | Royal Holiday",
  },
  description:
    "Discover Royal Holiday vacation-club membership. Explore destinations, understand Holiday Credits, and speak with a vacation specialist about options that fit the way you travel.",
  keywords: [
    "Royal Holiday",
    "vacation club",
    "timeshare membership",
    "Holiday Credits",
    "Park Royal",
    "vacation ownership",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Royal Holiday",
    title: "Royal Holiday | Vacation-Club Membership",
    description:
      "Explore vacation-club membership and discover whether Royal Holiday is right for the way you travel.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Luxury resort coastal view — placeholder social image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Holiday | Vacation-Club Membership",
    description:
      "Explore vacation-club membership with Royal Holiday. Speak with a vacation specialist.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        {children}
      </body>
    </html>
  );
}
