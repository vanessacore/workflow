import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { SelectedWork } from "@/components/site/selected-work";
import { AiWearables } from "@/components/site/ai-wearables";
import { Philosophy } from "@/components/site/philosophy";
import { Contact } from "@/components/site/contact";
import {
  HorizontalShowcase,
  type ShowcasePanel,
} from "@/components/site/horizontal-showcase";

const panels: ShowcasePanel[] = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "philosophy", label: "Philosophy" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <HorizontalShowcase panels={panels}>
      <Hero />
      <About />
      <SelectedWork />
      <AiWearables />
      <Philosophy />
      <Contact />
    </HorizontalShowcase>
  );
}
