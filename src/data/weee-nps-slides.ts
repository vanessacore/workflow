import type { CaseStudySlide } from "@/components/site/case-study-types";

export const weeeNpsSlides: CaseStudySlide[] = [
  {
    index: "00",
    eyebrow: "Case Study · Weee!",
    title: "In-app NPS —",
    italic: "a survey people actually finish.",
    body: "Weee! is North America's largest Asian and Hispanic grocery platform. Leadership needed a continuous read on loyalty as the company scaled — not a one-off survey, a system that could run every day without wrecking the shopping trip.",
    meta: [
      { label: "Role", value: "Product Designer" },
      { label: "Year", value: "2021" },
      { label: "Company", value: "Weee!" },
      { label: "Platform", value: "iOS · Android" },
    ],
    accent: "from-orange-400/30 via-amber-300/15 to-transparent",
  },
  {
    index: "01",
    eyebrow: "Context",
    title: "The brief —",
    italic: "measure loyalty without interrupting dinner.",
    body: "The company wanted NPS score and trend, plus actionable comments — continuously. The success bar from leadership was modest on paper (about 100 responses a day) and brutal in practice: grocery apps already fight for attention at the worst possible moment, right after someone has paid.",
    meta: [
      { label: "Goal", value: "Continuous NPS + trend" },
      { label: "Audience", value: "All grocery & restaurant buyers" },
      { label: "North star", value: "Useful, not nagging" },
    ],
    accent: "from-amber-300/25 via-orange-300/15 to-transparent",
  },
  {
    index: "02",
    eyebrow: "Discovery",
    title: "Six customers —",
    italic: "on when a survey feels like a tax.",
    body: "I interviewed six existing customers about seeing a survey in the app and what would actually get them to answer. Two constraints fell out immediately: we needed a reliable daily volume, and we could not feel like a modal that stands between someone and their groceries.",
    meta: [
      { label: "Interviews", value: "6 existing customers" },
      { label: "Risk", value: "Survey fatigue" },
      { label: "Need", value: "Daily volume, low friction" },
    ],
    accent: "from-rose-300/25 via-orange-300/15 to-transparent",
  },
  {
    index: "03",
    eyebrow: "Solution",
    title: "Two touchpoints —",
    italic: "when the trip is already over.",
    body: "We prompt NPS on order confirmation and on the account page — moments when the task is complete. After the score, an optional follow-up survey collects the why. Completing it earns 100 Weee Points ($1), and people can pause or quit without losing the score they already gave.",
    meta: [
      { label: "Prompts", value: "Order confirm · Account" },
      { label: "Follow-up", value: "Optional + 100 points" },
      { label: "Also shipped", value: "Ratings · store reviews" },
    ],
    accent: "from-emerald-300/25 via-lime-300/15 to-transparent",
  },
  {
    index: "04",
    eyebrow: "Testing",
    title: "A slider —",
    italic: "beat a list of numbers.",
    body: "We A/B tested two NPS input patterns. Seventy percent of people preferred a slider over a numbered list — it was easier to use and more engaging. That one interaction choice is the kind of detail that decides whether a survey gets 100 responses or a thousand.",
    meta: [
      { label: "Method", value: "Usability + A/B" },
      { label: "Winner", value: "Slider (70%)" },
      { label: "Why", value: "Ease + engagement" },
    ],
    accent: "from-cyan-300/25 via-sky-300/15 to-transparent",
  },
  {
    index: "05",
    eyebrow: "Outcome",
    title: "Ten times the goal —",
    italic: "and ratings that followed.",
    body: "Shipped September 2021. Leadership asked for 100 responses a day. We consistently cleared 1,000. App Store and Google Play ratings rose about 200% in three months. Weee's NPS stayed above 70 — and I left behind QA guidelines so design, product, and engineering could keep the bar after launch.",
    meta: [
      { label: "Daily NPS", value: "1,000+ responses" },
      { label: "Vs. goal", value: "10×" },
      { label: "Store ratings", value: "+200% in 3 months" },
    ],
    accent: "from-violet-300/25 via-fuchsia-300/15 to-transparent",
  },
];
