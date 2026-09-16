import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Weee! In-app NPS — Vanessa Core",
  description:
    "Product design case study: continuous in-app NPS for Weee! that earned 1,000+ responses a day — 10× the goal — and lifted store ratings about 200%.",
};

export default function WeeeNpsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
