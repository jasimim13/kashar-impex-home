import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { siteUrl } from "@/lib/content";
import "./globals.css";

// Self-hosted at build time by next/font: no request to Google, no layout shift while it loads.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

const description =
  "Construction and renovation company in Sialkot. Homes, bank branches, brand outlets, industrial buildings and multistory projects: grey structure, tiles, woodwork, ceilings, paint, roads and more. Call or WhatsApp 0332 1788788.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kashar Home Solutions | Construction and renovation in Sialkot",
  description,
  applicationName: "Kashar Home Solutions",
  keywords: [
    "Kashar Home Solutions",
    "construction company Sialkot",
    "renovation Sialkot",
    "building contractor Sialkot",
    "home renovation",
    "grey structure",
    "tile work",
    "woodwork",
    "false ceiling",
    "media wall",
    "road repair",
    "lump sum contract",
    "labour rate",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kashar Home Solutions",
    locale: "en_PK",
    title: "Kashar Home Solutions | Construction and renovation in Sialkot",
    description: "You have a problem? We have a solution. Construction and renovation in Sialkot.",
    images: [{ url: "/images/stage-after.jpg", width: 1220, height: 910, alt: "A finished stage built by Kashar Home Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashar Home Solutions | Construction and renovation in Sialkot",
    description: "You have a problem? We have a solution. Construction and renovation in Sialkot.",
    images: ["/images/stage-after.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f6f2",
};

// Runs before first paint so a saved dark theme never flashes light. Light unless the visitor chose dark.
const themeScript = `try{var d=localStorage.getItem("kashar-theme")==="dark";document.documentElement.dataset.theme=d?"dark":"light";if(d){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content","#0a0f0e")}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      className={jakarta.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Browser extensions often inject scripts into <head> before React loads; skip the hydration
            check on this one so they can't trigger a mismatch warning. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
