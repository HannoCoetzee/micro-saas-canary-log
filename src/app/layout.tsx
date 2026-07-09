import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CanaryLog — Transparency log & warrant canary",
  description:
    "Publish a cryptographically signed warrant canary and transparency log for your service.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://canarylog.uncomfortablebudget.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "CanaryLog",
    description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
    type: "website",
    url: "https://canarylog.uncomfortablebudget.com",
    siteName: "CanaryLog",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CanaryLog",
    description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  authors: [{ name: "Uncomfortable Budget" }],
  creator: "Uncomfortable Budget",
  publisher: "Uncomfortable Budget",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Uncomfortable Budget",
      url: "https://hub.uncomfortablebudget.com",
      logo: "https://hub.uncomfortablebudget.com/logo.svg",
      description: "A suite of affordable, focused Micro-SaaS tools built for indie founders.",
      sameAs: [],
    },
    {
      "@type": "SoftwareApplication",
      name: "CanaryLog",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Any",
      url: "https://canarylog.uncomfortablebudget.com",
      description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
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
      </body>
    </html>
  );
}