import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { SelectedWork } from "@/components/site/selected-work";
import { AiWearables } from "@/components/site/ai-wearables";
import { Philosophy } from "@/components/site/philosophy";
import { Contact } from "@/components/site/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SelectedWork />
      <AiWearables />
      <Philosophy />
      <Contact />
    </>
  );
}
