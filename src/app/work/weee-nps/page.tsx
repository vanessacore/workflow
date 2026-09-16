"use client";

import { CaseStudyDeck } from "@/components/site/case-study-deck";
import { weeeNpsSlides } from "@/data/weee-nps-slides";

export default function WeeeNpsPage() {
  return <CaseStudyDeck slides={weeeNpsSlides} />;
}
