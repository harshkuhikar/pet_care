import type { Metadata } from "next";
import { Suspense } from "react";
import { Fredoka, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { SiteLayoutWrapper } from "@/components/SiteLayoutWrapper";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Integrative Health, Longevity & Joy for Pets`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "integrative pet health",
    "holistic vet care",
    "canine acupuncture",
    "cat kidney disease diet",
    "rabbit GI stasis prevention",
    "raw dog food recipes",
    "pet longevity newsletter",
    "pet wall photos",
  ],
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: `${siteConfig.name} — Integrative Pet Health Platform`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "PawsWell Integrative Pet Health",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    audience: {
      "@type": "Audience",
      audienceType: "Pet Guardians, Dogs, Cats, Rabbits",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: "https://pawswell.pet/logo.png",
      },
    },
  };

  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${dmSans.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#FFFDF5] dark:bg-[#140E20] text-slate-900 dark:text-slate-100 transition-colors selection:bg-[#FFE600] selection:text-black"
      >
        <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
      </body>
    </html>
  );
}
