import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Atmosphere } from "@/components/site/atmosphere";
import { ScrollProgress } from "@/components/site/scroll-progress";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Vanessa Core — Product Designer",
  description:
    "Portfolio of Vanessa Hu (Vanessa Core), a product designer at Meta. AI-native products, 0→1 diagnostics, fintech, and growth systems — including Weee!'s in-app NPS.",
  metadataBase: new URL("https://vanessahuh.com"),
  openGraph: {
    title: "Vanessa Core — Product Designer",
    description:
      "AI-native product design. Shipped work across Meta, Weee!, Gilded, and Pinpoint Science.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanessa Core — Product Designer",
    description:
      "AI-native product design. Shipped work across Meta, Weee!, Gilded, and Pinpoint Science.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full scroll-smooth",
        geistSans.variable,
        geistMono.variable,
        instrumentSerif.variable,
        "font-sans antialiased",
      )}
    >
      <body className="relative min-h-full bg-background text-foreground overflow-x-hidden">
        <Atmosphere />
        <ScrollProgress />
        <main className="relative z-10 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
