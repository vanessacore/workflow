import type { CaseStudySlide } from "@/components/site/case-study-types";

export const casestudy1Slides: CaseStudySlide[] = [
  {
    index: "00",
    eyebrow: "Case Study · 01",
    title: "Aura —",
    italic: "an assistant that listens before it speaks.",
    body: "A glanceable, ambient AI companion designed to disappear into the rhythm of the day. This is the long-form story behind the system — the constraints, the prototypes, and the quiet decisions that shaped it.",
    meta: [
      { label: "Role", value: "Lead Product Designer" },
      { label: "Year", value: "2024 — 2025" },
      { label: "Team", value: "4 designers · 11 engineers" },
      { label: "Platform", value: "iOS · watchOS · Glass" },
    ],
    accent: "from-violet-400/30 via-fuchsia-300/15 to-transparent",
  },
  {
    index: "01",
    eyebrow: "Context",
    title: "The brief —",
    italic: "make AI feel less like a stage, more like a room.",
    body: "Most assistants demand a spotlight: wake words, modal screens, a stack of confirmations. We were asked to design the opposite — a companion that earns trust by getting out of the way, surfacing only what matters, and never breaking the moment.",
    meta: [
      { label: "Constraint", value: "Sub-200ms response" },
      { label: "Constraint", value: "On-device first" },
      { label: "North star", value: "Calm > clever" },
    ],
    accent: "from-indigo-400/25 via-violet-300/15 to-transparent",
  },
  {
    index: "02",
    eyebrow: "Discovery",
    title: "Six weeks of —",
    italic: "shadowing the in-between moments.",
    body: "We followed 22 people through their mornings, commutes, and quiet evenings. The findings were unromantic and useful: people don't want to talk to their devices, they want their devices to already know. The opportunity lived in the seam between intention and action.",
    meta: [
      { label: "Interviews", value: "22 participants" },
      { label: "Diary studies", value: "14 days" },
      { label: "Cities", value: "SF · NYC · Tokyo" },
    ],
    accent: "from-cyan-300/25 via-blue-300/15 to-transparent",
  },
  {
    index: "03",
    eyebrow: "Process",
    title: "Prototyping —",
    italic: "the texture of a presence.",
    body: "We built 30+ prototypes — most of them threw away. The ones that survived weren't the cleverest; they were the ones that let silence happen. We tuned latency, animation curves, and haptic grammar until the assistant felt less like a tool and more like a quiet roommate.",
    meta: [
      { label: "Prototypes", value: "32 explorations" },
      { label: "User tests", value: "9 rounds" },
      { label: "Survivors", value: "3 patterns" },
    ],
    accent: "from-emerald-300/25 via-teal-300/15 to-transparent",
  },
  {
    index: "04",
    eyebrow: "Solution",
    title: "A system that —",
    italic: "leans into ambient detail.",
    body: "The final design is a three-layer system: a passive ambient ring, a glanceable transient surface, and a focused conversational mode. Each layer is opt-in — you escalate up the stack only when you need to. Most interactions never leave the first layer.",
    meta: [
      { label: "Layers", value: "Ambient · Glance · Focus" },
      { label: "Components", value: "18 new patterns" },
      { label: "Motion specs", value: "47 documented" },
    ],
    accent: "from-amber-300/25 via-orange-300/15 to-transparent",
  },
  {
    index: "05",
    eyebrow: "Outcome",
    title: "Quiet wins —",
    italic: "and what we'd do again.",
    body: "Pilot users completed flows 38% faster while reporting lower cognitive load. More importantly, retention curves told a different story — people kept coming back not because the AI was impressive, but because it was forgettable in the best possible way.",
    meta: [
      { label: "Task completion", value: "+38% faster" },
      { label: "Self-reported calm", value: "+62%" },
      { label: "30-day retention", value: "84%" },
    ],
    accent: "from-rose-300/25 via-pink-300/15 to-transparent",
  },
];
