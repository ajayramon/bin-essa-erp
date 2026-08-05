import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { SessionProvider } from "@/lib/context/SessionContext";

export const metadata: Metadata = {
  title: {
    default: "Bin Essa ERP — Enterprise Retail & Wholesale Cloud Platform (Kuwait)",
    template: "%s | Bin Essa ERP Enterprise Cloud",
  },
  description:
    "Next-generation enterprise ERP platform for retail, wholesale, POS, promotions governance, double-entry accounting, and multi-branch inventory management in Kuwait and the GCC region.",
  keywords: [
    "Bin Essa ERP",
    "Kuwait ERP System",
    "Retail Point of Sale Kuwait",
    "POS Software Kuwait",
    "Double Entry Accounting KWD",
    "Promotions Management ERP",
    "GCC Inventory Software",
    "Post-Dated Check Clearing",
    "Multi-Branch ERP Platform",
  ],
  authors: [{ name: "Bin Essa Group Engineering" }],
  creator: "Bin Essa Enterprise Systems",
  publisher: "Bin Essa Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bin-essa-erp.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ar-KW": "/ar",
    },
  },
  openGraph: {
    title: "Bin Essa ERP — Enterprise Retail & Wholesale Cloud Platform",
    description:
      "Enterprise Cloud ERP tailored for Kuwait commercial governance, featuring high-speed POS, Promotion Engine, Manager PIN Overrides, 3-decimal KWD double-entry accounting, and real-time multi-branch stock transfers.",
    url: "https://bin-essa-erp.vercel.app",
    siteName: "Bin Essa ERP",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bin Essa ERP — Enterprise Cloud ERP Platform",
    description: "Next-gen enterprise ERP tailored for Kuwait retail & wholesale commercial operations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bin Essa ERP",
    operatingSystem: "Cloud Platform / Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KWD",
    },
    publisher: {
      "@type": "Organization",
      name: "Bin Essa Group",
      url: "https://bin-essa-erp.vercel.app",
    },
    description:
      "Commercial ERP solution enforcing Kuwait commercial compliance, 3-decimal KWD precision, double-entry financial accounting, and high-speed POS register shift balancing.",
  };

  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <LocaleProvider>
          <SessionProvider>{children}</SessionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}