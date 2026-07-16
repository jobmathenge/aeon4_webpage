import type { Metadata } from "next";
import { IBM_Plex_Mono, Michroma, Space_Grotesk } from "next/font/google";
import Aurora from "@/components/Aurora";
import Footer from "@/components/Footer";
import IconSprite from "@/components/IconSprite";
import Nav from "@/components/Nav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-michroma",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aeon4.ai"),
  title: "AeOn4.AI, Secure, AI-Enabled Spaces and Production",
  description:
    "AeOn4.AI, securing AI-enabled spaces and production, offers three AI-native copilots for OT security, building management, and production IoT across the GCC and Africa.",
  authors: [{ name: "Job Mathenge", url: "https://aeon4.ai" }],
  openGraph: {
    title: "AeOn4.AI, Secure, AI-Enabled Spaces and Production",
    description:
      "Three AI-native copilots for OT security, building management, and production IoT across the GCC and Africa.",
    type: "website",
    url: "https://aeon4.ai",
  },
  twitter: {
    card: "summary",
  },
};

export const viewport = {
  themeColor: "#03101d",
  width: "device-width",
  initialScale: 1,
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AeOn4.AI",
  slogan: "Secure, AI-Enabled Spaces and Production",
  description: "AI-native copilots for OT security, building management systems, and production IoT.",
  areaServed: ["Saudi Arabia", "United Arab Emirates", "Kenya", "GCC", "Sub-Saharan Africa"],
  email: "info@aeon4.ai",
  url: "https://aeon4.ai",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexMono.variable} ${michroma.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // Static, hand-authored structured data, which is safe to inject directly.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body>
        <IconSprite />
        <Aurora />
        <a href="#copilots" className="skip">
          Skip to content
        </a>
        <div id="progress" />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
