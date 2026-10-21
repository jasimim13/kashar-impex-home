import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Self-hosted at build time by next/font: no request to Google, no layout shift while it loads.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Kashar Home Solutions | Construction and renovation",
  description:
    "Construction and renovation for homes, bank branches, brand outlets, industrial buildings and multistory projects. Lump sum or labour rate contracts. Call or WhatsApp 0332 1788788.",
  openGraph: {
    title: "Kashar Home Solutions",
    description: "Construction and renovation, from the first drawing to the final coat of paint.",
    images: ["/images/stage-after.jpg"],
  },
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
