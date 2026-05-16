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
  title: "Vanessa Core — Product Designer · AI & Wearables",
  description:
    "Portfolio of Vanessa Core, a product designer crafting AI experiences and next-generation wearables at Meta. Cinematic interfaces, ambient intelligence, and the future of human–computer interaction.",
  metadataBase: new URL("https://vanessahuh.com"),
  openGraph: {
    title: "Vanessa Core — Product Designer · AI & Wearables",
    description:
      "Crafting AI experiences and next-generation wearables. A portfolio in cinematic detail.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanessa Core — Product Designer · AI & Wearables",
    description:
      "Crafting AI experiences and next-generation wearables.",
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
