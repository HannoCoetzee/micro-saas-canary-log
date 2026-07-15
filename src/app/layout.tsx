import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CanaryLog — Transparency log & warrant canary",
  description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://canarylog.uncomfortablebudget.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CanaryLog — Transparency log & warrant canary",
    description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
    type: "website",
    url: "https://canarylog.uncomfortablebudget.com",
    siteName: "Uncomfortable Budget",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CanaryLog — Transparency log & warrant canary",
    description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CanaryLog",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  url: "https://canarylog.uncomfortablebudget.com",
  description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
