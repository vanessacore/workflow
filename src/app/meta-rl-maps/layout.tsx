import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maps on Display Glasses — Meta RL Case Study",
  description:
    "Local search and navigation for Ray-Ban Meta display glasses — maps and place discovery designed for heads-up, on-foot context.",
  openGraph: {
    title: "Maps on Display Glasses — Meta RL",
    description:
      "Local search and navigation for Ray-Ban Meta display glasses.",
    type: "article",
  },
};

export default function MetaRlMapsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
