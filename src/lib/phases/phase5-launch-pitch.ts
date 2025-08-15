// EIC Pathway – Phase 5 (Launch & Pitch) Plug‑and‑Play Module
// Drop-in TypeScript data module for your web app.
// Mirrors Phase 1–4 structure with ≤7 tasks, XP, templates, and a final code‑gate.

// -----------------
// Types & Interfaces (standalone)
// -----------------
export type TaskType =
  | "video"
  | "exercise"
  | "assignment"
  | "peer_review"
  | "research"
  | "experiment"
  | "submission";

export type EvidenceType = "none" | "text" | "file" | "url" | "quiz";

export interface ResourceLink {
  label: string;
  url: string;
  type?: "video" | "doc" | "template" | "example" | "external";
}

export interface UnlockRule {
  kind: "code_gate" | "auto";
  code_hint?: string;
}

export interface CompletionCriterion {
  description: string;
  required: boolean;
}

export interface RubricItem {
  criterion: string;
  levels: { label: string; description: string; points: number }[];
}

export interface Task {
  id: string;
  order: number;
  type: TaskType;
  title: string;
  summary: string;
  details_md: string;
  estimated_minutes: number;
  xp: number;
  resources?: ResourceLink[];
  template_md?: string;
  completion: CompletionCriterion[];
  evidence: EvidenceType;
  quiz?: {
    questions: {
      id: string;
      prompt: string;
      options: string[];
      answer_index: number;
      explanation: string;
    }[];
    passing_score: number;
  };
  rubric?: RubricItem[];
}

export interface PhaseDefinition {
  id: string;
  title: string;
  goal: string;
  intro_md: string;
  xp_total: number;
  unlock: UnlockRule;
  tasks: Task[];
}

// -----------------
// Phase 5 Content
// -----------------
const INTRO = `
**Goal:** Prepare for a real launch and communicate your value clearly. You'll package a go‑to‑market plan, lightweight economics, a pitch deck, and a launch demo.\n\n
**What you'll do**\n- Clarify positioning and ideal customer profile (ICP).\n- Define channels, messages, and funnel targets for launch.\n- Draft pricing and unit economics to sanity‑check viability.\n- Plan and execute a lightweight launch (beta/pilot or waitlist).\n- Create a concise, compelling pitch deck and rehearse delivery.\n- Submit a Launch Packet for staff review to complete the EIC Pathway.\n\n**Estimated time:** ~5–8 hours depending on depth and assets.\n`;

export const Phase5LaunchPitch: PhaseDefinition = {
  id: "phase-5-launch-pitch",
  title: "Phase 5: Launch & Pitch",
  goal: "Package a credible launch plan and deliver a concise pitch supported by evidence.",
  intro_md: INTRO,
  unlock: {
    kind: "code_gate",
    code_hint:
      "Bring your approved Launch Packet to the EIC desk to receive your completion code and next‑steps referral (SLP, Hatchery, EiR).",
  },
  tasks: [
    {
      id: "p5-t1-positioning-icp",
      order: 1,
      type: "exercise",
      title: "Positioning Statement & ICP",
      summary:
        "Craft a crisp positioning statement and define your ideal customer profile using evidence from prior phases.",
      details_md: `\nUse the template to finalize your **Positioning** and **ICP** before launch messaging. Keep it specific and testable.`,
      estimated_minutes: 35,
      xp: 100,
      template_md: `\n# Positioning & ICP\n\n**For (ICP):** _e.g., commuter students at BSU_\n**Who struggle with:** _pain_\n**Our solution:** _what it is (category)_\n**Unlike:** _current alternatives_\n**We:** _unique benefit / differentiation_\n\n**ICP Snapshot:**\n- Segment:\n- Must‑have characteristics (3):\n- Where to find them (channels/communities):\n- Key message (≤20 words):\n`,
      completion: [
        { description: "Upload completed Positioning & ICP (PDF/Doc)", required: true },
      ],
      evidence: "file",
      resources: [
        { label: "Positioning primer (article)", url: "https://example.org/eic/resources/positioning", type: "external" },
      ],
    },

    {
      id: "p5-t2-gtm-plan",
      order: 2,
      type: "assignment",
      title: "Go‑to‑Market Plan: Channels & Funnel Targets",
      summary:
        "Define 2–3 acquisition channels, draft first‑touch messages, and set top‑of‑funnel targets for a 2‑week window.",
      details_md: `\nPick **2–3 channels** (e.g., student org partnerships, email, Instagram/TikTok, events, campus flyers/QR, EIC events).\nSet **numerical targets** for reach → clicks → signups (or interviews/bookings).`,
      estimated_minutes: 45,
      xp: 120,
      template_md: `\n# GTM Plan (2‑Week Sprint)\n\n**Channels (2–3):**\n1. Channel / message / CTA / owner / start date\n2. Channel / message / CTA / owner / start date\n3. (optional)\n\n**Targets:**\n- Reach: ___\n- Clicks/Responses: ___\n- Signups/Bookings: ___\n\n**Assets to create:** _landing page, social posts, email copy, flyer, tabling script_\n`,
      completion: [
        { description: "Upload GTM Plan (PDF/Doc)", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p5-t3-pricing-unit-econ",
      order: 3,
      type: "exercise",
      title: "Pricing & Unit Economics (Lightweight)",
      summary:
        "Draft initial pricing, rough costs, and a simple CAC:LTV sanity check. This is not financial advice.",
      details_md:
        "Use conservative assumptions. You can update later after launch learning.",
      estimated_minutes: 40,
      xp: 110,
      template_md: `\n# Pricing & Unit Economics (Lite)\n\n**Price:** _$/month, $/unit, or freemium w/ upgrade_\n**COGS per unit:** _hosting, tools, materials_\n**Gross Margin:** _(Price − COGS) / Price_\n\n**Acquisition (per channel):**\n- Est. CAC: _$/signup or $/customer_\n\n**Retention/Value:**\n- Est. LTV: _$/customer_ (assumptions: ARPU, months retained)\n\n**Sanity Check:** _Is LTV ≥ 3× CAC?_\n\n**Notes & Risks:** _assumptions to validate next_
`,
      completion: [
        { description: "Upload pricing & unit economics worksheet", required: true },
      ],
      evidence: "file",
      resources: [
        { label: "Unit economics explainer (article)", url: "https://example.org/eic/resources/unit-econ", type: "external" },
      ],
    },

    {
      id: "p5-t4-launch-sprint",
      order: 4,
      type: "experiment",
      title: "Launch Sprint (Beta/Pilot or Waitlist)",
      summary:
        "Run a 7–14 day mini‑launch: pilot with users or collect waitlist signups. Report KPI results vs targets.",
      details_md: `\nUse your GTM plan. Provide a **URL** to your landing page/app and a short results summary.`,
      estimated_minutes: 90,
      xp: 140,
      template_md: `\n# Launch Sprint Results\n\n**Window:** _dates_\n**Channel Performance:**\n- Ch1: reach → clicks → signups/uses\n- Ch2: …\n\n**KPI vs Target:** _table or bullets_\n\n**Top 3 Learnings:**\n1.\n2.\n3.\n\n**Next Action:** _what you'll change next week_\n`,
      completion: [
        { description: "Provide live URL (landing/app)", required: true },
        { description: "Upload results summary (PDF/Doc)", required: true },
      ],
      evidence: "url",
    },

    {
      id: "p5-t5-pitch-deck",
      order: 5,
      type: "assignment",
      title: "Pitch Deck Draft (10–12 slides)",
      summary:
        "Create a concise slide deck: Problem, Audience, Solution, Demo, Market, Model, Competition, Traction, GTM, Team, Ask.",
      details_md:
        "Keep each slide focused and visual. Include a 30–60s demo GIF/video link on the Solution/Demo slide.",
      estimated_minutes: 75,
      xp: 140,
      template_md: `\n# Pitch Deck Outline (10–12)\n1. Title & Vision\n2. Problem (evidence)\n3. Audience / ICP\n4. Solution (demo link)\n5. Market (TAM/SAM/SOM)\n6. Business Model (pricing)\n7. Competition & Differentiation\n8. Traction (Phase 2–5 metrics)\n9. Go‑to‑Market (channels & early results)\n10. Team (why us)\n11. Ask (mentorship, SLP, pilots, $ if relevant)\n12. Appendix (screens, data)\n`,
      completion: [
        { description: "Upload deck (PDF or link)", required: true },
      ],
      evidence: "file",
      rubric: [
        {
          criterion: "Clarity & story arc",
          levels: [
            { label: "Basic", description: "Covers points but unclear", points: 10 },
            { label: "Proficient", description: "Clear problem→solution→evidence flow", points: 20 },
            { label: "Excellent", description: "Compelling narrative with sharp visuals", points: 30 },
          ],
        },
        {
          criterion: "Evidence & metrics",
          levels: [
            { label: "Basic", description: "Anecdotes only", points: 10 },
            { label: "Proficient", description: "Some quantified results", points: 20 },
            { label: "Excellent", description: "Strong quantified traction & clear targets", points: 30 },
          ],
        },
      ],
    },

    {
      id: "p5-t6-pitch-practice",
      order: 6,
      type: "peer_review",
      title: "2‑Minute Pitch Practice (Peer/Mentor Feedback)",
      summary:
        "Record a 2‑minute pitch or present live to peers/mentor; collect at least 2 pieces of structured feedback.",
      details_md: `\nUse the feedback template. Aim for: hook → problem → solution → proof → ask.`,
      estimated_minutes: 40,
      xp: 100,
      template_md: `\n# Pitch Feedback Form\n\n**Clarity (1–5):**\n**Story (1–5):**\n**Evidence (1–5):**\n**Delivery (1–5):**\n**Most actionable suggestion:** _one sentence_\n`,
      completion: [
        { description: "Attach video link or confirmation + 2 feedback forms", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p5-t7-launch-packet",
      order: 7,
      type: "submission",
      title: "Submit Launch Packet (Completion Code)",
      summary:
        "Bundle your key assets for review: Positioning & ICP, GTM Plan, Unit Economics, Launch Results, Pitch Deck, Pitch Video link.",
      details_md: `\nAfter approval, you'll receive your **EIC Pathway completion code** and a referral into the most relevant EIC opportunity (e.g., **SLP**, **Hatchery**, **EiR**).`,
      estimated_minutes: 45,
      xp: 160,
      template_md: `\n# Launch Packet Checklist\n- Positioning & ICP (PDF)\n- GTM Plan (PDF)\n- Pricing & Unit Economics (PDF)\n- Launch Sprint Results (PDF) + live link\n- Pitch Deck (PDF or link)\n- 2‑Minute Pitch (video link)\n`,
      completion: [
        { description: "Upload Launch Packet (single folder/ZIP or links doc)", required: true },
      ],
      evidence: "file",
      rubric: [
        {
          criterion: "Readiness to launch",
          levels: [
            { label: "Basic", description: "Some gaps; unclear targets", points: 10 },
            { label: "Proficient", description: "Plan, assets, and targets in place", points: 20 },
            { label: "Excellent", description: "Strong assets + initial traction & clear next steps", points: 30 },
          ],
        },
      ],
    },
  ],
  get xp_total() {
    return this.tasks.reduce((s, t) => s + t.xp, 0);
  },
} as unknown as PhaseDefinition;

// Helpers
export function getPhaseXP(phase: PhaseDefinition): number {
  return phase.tasks.reduce((sum, t) => sum + t.xp, 0);
}

export function isPhaseComplete(
  phase: PhaseDefinition,
  taskStatuses: Record<string, { completed: boolean }>
): boolean {
  return phase.tasks.every((t) => taskStatuses[t.id]?.completed);
}
