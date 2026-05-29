"use client";

import { CaseStudyDeck } from "@/components/site/case-study-deck";
import { casestudy1Slides } from "@/data/casestudy1-slides";

export default function CaseStudy1Page() {
  return <CaseStudyDeck slides={casestudy1Slides} />;
}
