"use client";

import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { SelectedWork } from "@/components/site/selected-work";
import { Experience } from "@/components/site/experience";
import { Philosophy } from "@/components/site/philosophy";
import { Contact } from "@/components/site/contact";
import { Nav } from "@/components/site/nav";
import {
  HorizontalShowcase,
  type ShowcasePanel,
} from "@/components/site/horizontal-showcase";

const panels: ShowcasePanel[] = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "selected-work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "philosophy", label: "Philosophy" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <Nav />
      <HorizontalShowcase panels={panels}>
        <Hero />
        <About />
        <SelectedWork />
        <Experience />
        <Philosophy />
        <Contact />
      </HorizontalShowcase>
    </>
  );
}
