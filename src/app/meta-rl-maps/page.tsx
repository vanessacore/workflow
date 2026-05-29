"use client";

import { CaseStudyDeck } from "@/components/site/case-study-deck";
import { metaRlMapsSlides } from "@/data/meta-rl-maps-slides";

export default function MetaRlMapsPage() {
  return <CaseStudyDeck slides={metaRlMapsSlides} />;
}
