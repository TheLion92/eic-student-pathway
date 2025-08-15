// EIC Pathway – Phase 1 (Ideation) Plug‑and‑Play Module
// Drop-in TypeScript data module for your web app.
// - Exposes a strongly-typed schema for phases and tasks
// - Provides complete content for Phase 1: Ideation (≤7 tasks)
// - Includes gamification hooks (XP), completion criteria, and unlock-code gate
// - Compatible with email SSO gating you already built; just wire the submission review to staff dashboard

// -----------------
// Types & Interfaces
// -----------------
export type TaskType =
  | "video"
  | "exercise"
  | "assignment"
  | "peer_review"
  | "research"
  | "submission";

export type EvidenceType = "none" | "text" | "file" | "url" | "quiz";

export interface ResourceLink {
  label: string;
  url: string;
  type?: "video" | "doc" | "template" | "example" | "external";
}

export interface UnlockRule {
  // For Phase 1, we use a staff-issued code after review at the EIC desk
  kind: "code_gate" | "auto";
  code_hint?: string; // optional hint shown to students
}

export interface CompletionCriterion {
  description: string;
  required: boolean; // if false, counts as bonus/extra credit
}

export interface RubricItem {
  criterion: string;
  levels: { label: string; description: string; points: number }[]; // e.g., {Beginner, Proficient, Excellent}
}

export interface Task {
  id: string; // stable ID for storage
  order: number; // display order
  type: TaskType;
  title: string;
  summary: string;
  details_md: string; // Markdown body shown in task view
  estimated_minutes: number;
  xp: number; // gamification points
  resources?: ResourceLink[];
  template_md?: string; // optional inline template the UI can render as a downloadable .md
  completion: CompletionCriterion[]; // what must be done for completion
  evidence: EvidenceType; // how the learner proves completion
  quiz?: {
    questions: {
      id: string;
      prompt: string;
      options: string[];
      answer_index: number; // 0-based index of correct answer
      explanation: string;
    }[];
    passing_score: number; // percentage 0-100 required to pass
  };
  rubric?: RubricItem[]; // used by staff/peer review
}

export interface PhaseDefinition {
  id: string; // "phase-1-ideation"
  title: string; // "Phase 1: Ideation"
  goal: string; // phase goal statement
  intro_md: string; // long-form intro displayed at top
  xp_total: number; // sum of task XP
  unlock: UnlockRule; // how to unlock next phase
  tasks: Task[]; // up to 7 tasks
}

// -----------------
// Phase 1 Content
// -----------------
const INTRO = `
**Goal:** Move from a vague idea to a clearly defined concept with a crisp problem statement, target user, and differentiator.

**How this phase works**
- Complete each task in order.
- Earn XP as you go and track progress with the phase progress bar.
- When you submit your one‑pager, an EIC staff member will review it. If approved, you'll receive an unlock code at the EIC to move to Phase 2 (Validation).

**Estimated time:** ~3–5 hours total depending on depth.
`;

export const Phase1Ideation: PhaseDefinition = {
  id: "phase-1-ideation",
  title: "Phase 1: Ideation",
  goal: "Identify a real problem, understand the audience, and articulate a clear concept one‑pager.",
  intro_md: INTRO,
  unlock: {
    kind: "code_gate",
    code_hint: "Stop by the EIC desk after your one‑pager is approved to receive your unlock code.",
  },
  tasks: [
    {
      id: "p1-t1-problem-video",
      order: 1,
      type: "video",
      title: "Finding a Problem Worth Solving",
      summary:
        "Watch a short video on spotting real problems and opportunities before jumping to solutions.",
      details_md: `
**Why this matters**: Successful ventures start with a specific, painful problem. This primer shows how to spot and frame those problems.

**Watch & note**: Capture **three takeaways** and **one example** from your life/class/work where you notice the problem.
`,
      estimated_minutes: 15,
      xp: 50,
      resources: [
        {
          label: "Primer video (5–7 min)",
          url: "https://player.vimeo.com/video/945000001", // placeholder – swap with your hosted video
          type: "video",
        },
      ],
      completion: [
        { description: "Write 3 bullet takeaways", required: true },
        { description: "Add 1 real example you observed", required: true },
      ],
      evidence: "text",
    },

    {
      id: "p1-t2-problem-statement",
      order: 2,
      type: "exercise",
      title: "Problem Statement Worksheet",
      summary:
        "Craft a one‑paragraph problem statement: who has the problem, why it matters, and the consequence of inaction.",
      details_md: `
Use the template to write a concise problem statement. Aim for **3–5 sentences**. Be specific about the user and the situation.
`,
      estimated_minutes: 25,
      xp: 80,
      template_md: `
# Problem Statement Template

**User/Customer:** _Describe a specific person or segment_

**Context:** _Where/when does the problem occur?_

**Pain:** _What is hard, costly, or risky right now?_

**Impact of Inaction:** _What happens if this is not solved?_

**Early Hypothesis:** _One sentence hinting at a possible direction (not a full solution)._
`,
      completion: [
        { description: "Submit a 3–5 sentence statement using the template", required: true },
      ],
      evidence: "file",
      resources: [
        { label: "Example problem statements", url: "https://example.org/eic/examples/problem", type: "doc" },
      ],
    },

    {
      id: "p1-t3-empathy-map",
      order: 3,
      type: "exercise",
      title: "Empathy Map: Know Your User",
      summary:
        "Fill out an empathy map (Think/Feel/Say/Do) to deepen understanding of your target user.",
      details_md: `
Interview or observe **one potential user** if possible. Otherwise, base this on credible assumptions you will validate later.
`,
      estimated_minutes: 35,
      xp: 100,
      template_md: `
# Empathy Map

**User persona name/title:**

**THINKS:** _What occupies their thoughts? Beliefs?_

**FEELS:** _Emotions tied to the problem?_

**SAYS:** _Quotes or paraphrases?_

**DOES:** _Actions/behaviors around the problem?_

**Top 3 Pains:**
1.
2.
3.

**Top 3 Gains (desired outcomes):**
1.
2.
3.
`,
      completion: [
        { description: "Upload completed empathy map", required: true },
      ],
      evidence: "file",
      resources: [
        { label: "Empathy map explainer (article)", url: "https://example.org/eic/resources/empathy-map", type: "external" },
      ],
    },

    {
      id: "p1-t4-competitor-scan",
      order: 4,
      type: "research",
      title: "30‑Minute Competitor Scan",
      summary:
        "Identify at least two existing solutions and note how your idea differs (or serves a niche).",
      details_md: `
Search the web/app stores/classroom tools. Capture **name, target user, key features, pricing, and your differentiation**.
`,
      estimated_minutes: 30,
      xp: 90,
      template_md: `
# Quick Competitor Scan

| Solution | Target User | Top Features | Pricing | Your Differentiation |
|---|---|---|---|---|
| ExampleCo | | | | |
| SecondApp | | | | |

**Notes:** _Where are the gaps/opportunities?_
`,
      completion: [
        { description: "List 2+ competing/alternative solutions", required: true },
        { description: "State at least one differentiation", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p1-t5-peer-feedback",
      order: 5,
      type: "peer_review",
      title: "Peer Feedback Round",
      summary:
        "Share your idea and gather at least two peer comments to refine the concept.",
      details_md: `
Post your problem statement and empathy map to the course forum or shared doc. Ask specifically: 
- *What is unclear?*
- *What evidence would make this stronger?*
- *What assumptions should I validate next?*
`,
      estimated_minutes: 20,
      xp: 60,
      completion: [
        { description: "Attach screenshot/links showing ≥2 peer comments", required: true },
      ],
      evidence: "url",
      resources: [
        { label: "Feedback guide (one‑pager)", url: "https://example.org/eic/guides/peer-feedback", type: "doc" },
      ],
      rubric: [
        {
          criterion: "Quality of revisions based on feedback",
          levels: [
            { label: "Basic", description: "Acknowledges comments", points: 10 },
            { label: "Proficient", description: "Implements 1–2 concrete changes", points: 20 },
            { label: "Excellent", description: "Synthesizes feedback into clear refinements", points: 30 },
          ],
        },
      ],
    },

    {
      id: "p1-t6-concepts-quiz",
      order: 6,
      type: "assignment",
      title: "Micro‑Quiz: Problem vs Solution Thinking",
      summary:
        "Short check for understanding before you draft your one‑pager.",
      details_md: `Answer all questions; score ≥70% to pass.`,
      estimated_minutes: 8,
      xp: 50,
      completion: [{ description: "Score ≥70% on quiz", required: true }],
      evidence: "quiz",
      quiz: {
        passing_score: 70,
        questions: [
          {
            id: "q1",
            prompt:
              "Which is the *best* problem statement?",
            options: [
              "Students need an app that shares events.",
              "Many commuter students miss campus opportunities because event info is fragmented across emails, flyers, and multiple apps.",
              "We will build a social platform for campus life.",
              "Everyone wants better communication at school.",
            ],
            answer_index: 1,
            explanation:
              "It specifies *who* (commuter students), *pain* (miss opportunities), and *cause* (fragmented info).",
          },
          {
            id: "q2",
            prompt: "What should come *before* designing features?",
            options: [
              "Brand palette",
              "Competitor scan and empathy work",
              "Pricing page",
              "Launch party plan",
            ],
            answer_index: 1,
            explanation: "Understand users and context first.",
          },
          {
            id: "q3",
            prompt: "A differentiation statement should…",
            options: [
              "List all features",
              "Name your programming language",
              "Explain how you uniquely solve a focused user need",
              "Promise to be cheaper than everyone",
            ],
            answer_index: 2,
            explanation: "Differentiation is about a unique, valuable approach to a specific need.",
          },
        ],
      },
    },

    {
      id: "p1-t7-onepager",
      order: 7,
      type: "submission",
      title: "Submit Your One‑Page Concept Summary (Unlocks Phase 2)",
      summary:
        "Combine your work into a crisp one‑pager. Staff will review and issue the unlock code if approved.",
      details_md: `
Your one‑pager should include:
1) Problem statement, 2) Target user persona, 3) Key pains/gains, 4) Competitor snapshot, 5) Your differentiation, 6) Success criteria for validation next phase.
`,
      estimated_minutes: 40,
      xp: 150,
      template_md: `
# One‑Page Concept Summary

**Project Name:**

**Problem Statement:**

**Target User Persona (1–2 sentences):**

**Top 3 Pains / Desired Gains:**
- Pain/Gain 1
- Pain/Gain 2
- Pain/Gain 3

**Competitor Snapshot (2+):**
- Solution A – what it does / gap
- Solution B – what it does / gap

**Your Differentiation (1–2 sentences):**

**Validation Criteria for Phase 2:** _What evidence will convince you the problem is real (e.g., 5 interviews confirming pains, 20 sign‑ups to test, etc.)_
`,
      completion: [
        { description: "Upload final one‑pager (PDF or Doc)", required: true },
      ],
      evidence: "file",
      rubric: [
        {
          criterion: "Clarity of problem & user",
          levels: [
            { label: "Basic", description: "General audience, broad pain", points: 10 },
            { label: "Proficient", description: "Specific audience and pain", points: 20 },
            { label: "Excellent", description: "Narrow, well‑evidenced user & pain", points: 30 },
          ],
        },
        {
          criterion: "Quality of differentiation",
          levels: [
            { label: "Basic", description: "Vague or feature list", points: 10 },
            { label: "Proficient", description: "Clear angle vs. others", points: 20 },
            { label: "Excellent", description: "Compelling, user‑anchored edge", points: 30 },
          ],
        },
      ],
    },
  ],
  get xp_total() {
    return this.tasks.reduce((sum, t) => sum + t.xp, 0);
  },
} as unknown as PhaseDefinition;

// -------------
// Simple helpers
// -------------
export function getPhaseXP(phase: PhaseDefinition): number {
  return phase.tasks.reduce((sum, t) => sum + t.xp, 0);
}

export function isPhaseComplete(
  phase: PhaseDefinition,
  taskStatuses: Record<string, { completed: boolean }>
): boolean {
  return phase.tasks.every((t) => taskStatuses[t.id]?.completed);
}
