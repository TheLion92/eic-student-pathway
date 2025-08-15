// EIC Pathway – Phase 2 (Validation) Plug‑and‑Play Module
// Drop-in TypeScript data module for your web app.
// Mirrors Phase 1 schema and adds authored content for Phase 2 with ≤7 tasks.
// Includes gamification (XP), completion criteria, quiz, and a code-gated unlock to Phase 3.

// -----------------
// Types & Interfaces (kept local so this file is standalone)
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
// Phase 2 Content
// -----------------
const INTRO = `
**Goal:** Validate that the problem is real, your audience experiences the pain, and your early solution direction is worth building.\n\n
**What you'll do**\n- Define your riskiest assumption and craft a testable hypothesis.\n- Run **problem interviews** (not pitching) and synthesize insights.\n- Run one **lightweight experiment** (survey or landing page pre‑signup) with clear success metrics.\n- Submit a **Validation Report** for staff review to unlock Phase 3 (Build).\n\n**Estimated time:** ~4–6 hours depending on number of interviews and experiment depth.\n`;

export const Phase2Validation: PhaseDefinition = {
  id: "phase-2-validation",
  title: "Phase 2: Validation",
  goal: "Gather evidence that your problem and audience are real and your direction is promising.",
  intro_md: INTRO,
  unlock: {
    kind: "code_gate",
    code_hint: "Bring your approved Validation Report to the EIC desk to receive the unlock code for Phase 3.",
  },
  tasks: [
    {
      id: "p2-t1-validation-video",
      order: 1,
      type: "video",
      title: "What is Validation? (Evidence over Opinions)",
      summary: "Watch a short primer on hypotheses, interviews, and small experiments.",
      details_md: `\n**Take notes**: Write two examples of *good* evidence and one example of a *vanity metric* to avoid.\n`,
      estimated_minutes: 12,
      xp: 50,
      resources: [
        { label: "Primer video (6–8 min)", url: "https://player.vimeo.com/video/945000101", type: "video" },
      ],
      completion: [
        { description: "List 2 good evidence examples", required: true },
        { description: "List 1 vanity metric to avoid", required: true },
      ],
      evidence: "text",
    },

    {
      id: "p2-t2-riskiest-assumption",
      order: 2,
      type: "exercise",
      title: "Riskiest Assumption & Hypothesis",
      summary: "Identify the one assumption that, if false, makes the idea not worth building—then write a testable hypothesis.",
      details_md: `\nUse the template to pick **one riskiest assumption** (about *problem*, *user*, or *behavior*). Turn it into a hypothesis with a measurable **success metric** and **time window**.\n`,
      estimated_minutes: 25,
      xp: 90,
      template_md: `\n# Riskiest Assumption & Hypothesis\n\n**Riskiest Assumption:** _e.g., Commuter students miss opportunities due to fragmented info_\n\n**Hypothesis:** _If we show a single consolidated feed, at least 60% of interviewed commuters will say this would solve their current pain._\n\n**Metric & Threshold:** _e.g., ≥60% express strong intent; or ≥15 qualified sign‑ups in 72 hours_\n\n**Time Window:** _e.g., 3 days_\n\n**Plan to Test:** _Interviews, survey, landing page, or combo_\n`,
      completion: [
        { description: "Upload completed hypothesis template", required: true },
      ],
      evidence: "file",
      resources: [
        { label: "Hypothesis examples", url: "https://example.org/eic/examples/hypotheses", type: "doc" },
      ],
    },

    {
      id: "p2-t3-interview-script",
      order: 3,
      type: "assignment",
      title: "Problem Interview Plan (3–5 interviews)",
      summary: "Draft an interview script and talk to 3–5 target users without pitching your solution.",
      details_md: `\n**Guidelines**\n- Open with the context of their day.\n- Ask about recent times they felt the pain.\n- Ask for specifics (when, where, tools, workarounds, costs).\n- Avoid leading questions and avoid pitching.\n\n**Deliverable**: Upload your script AND anonymized notes (or transcripts).\n`,
      estimated_minutes: 60,
      xp: 120,
      template_md: `\n# Interview Script (Problem Discovery)\n\n1. Tell me about the last time you [experienced context].\n2. What made that difficult?\n3. What did you try to solve it?\n4. What did that cost you (time/money/frustration)?\n5. How do you handle it today?\n6. If this were magically solved, what would be different?\n`,
      completion: [
        { description: "Upload script (PDF/Doc)", required: true },
        { description: "Attach notes from 3–5 interviews", required: true },
      ],
      evidence: "file",
      resources: [
        { label: "Interview do's & don'ts (1‑pager)", url: "https://example.org/eic/guides/interviews", type: "doc" },
      ],
      rubric: [
        {
          criterion: "Quality of questions (non‑leading, specific)",
          levels: [
            { label: "Basic", description: "Some leading or solution talk", points: 10 },
            { label: "Proficient", description: "Mostly problem‑focused, neutral", points: 20 },
            { label: "Excellent", description: "Sharp, open, elicits stories & specifics", points: 30 },
          ],
        },
      ],
    },

    {
      id: "p2-t4-synthesis",
      order: 4,
      type: "exercise",
      title: "Interview Synthesis: Insights & Patterns",
      summary: "Turn raw notes into patterns and prioritized pains/gains.",
      details_md: `\nUse the template to summarize **Top 5 insights**, **repeated quotes**, and a **pain ranking**.\n`,
      estimated_minutes: 35,
      xp: 100,
      template_md: `\n# Synthesis Board\n\n**Top 5 Insights (bullets):**\n1.\n2.\n3.\n4.\n5.\n\n**Representative Quotes:**\n- \n- \n\n**Pain Ranking (1 high → 5 low):**\n| Pain | Evidence/Quote | Rank |\n|---|---|---|\n| | | |\n\n**Implications for Solution Direction:**\n- \n- \n`,
      completion: [
        { description: "Upload completed synthesis board", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p2-t5-experiment",
      order: 5,
      type: "experiment",
      title: "Lightweight Experiment (Choose One)",
      summary: "Run one small test with a clear metric: a survey (10–15 respondents) **or** a landing page with pre‑signups.",
      details_md: `\n**Option A – Survey**: 10–15 qualified respondents. Include 1–2 open questions from interviews to quantify prevalence.\n**Option B – Landing Page**: Simple page stating the problem and value—collect emails or interest clicks.\n\n**Pick a success threshold** from your hypothesis (e.g., ≥12 qualified responses in 72 hours; or ≥15 sign‑ups).\nUpload screenshot/URL and a 3‑sentence results summary.\n`,
      estimated_minutes: 60,
      xp: 120,
      template_md: `\n# Experiment Plan & Result\n\n**Type:** Survey | Landing page\n\n**Metric & Threshold:**\n\n**Run Window:**\n\n**Result:** _numbers observed_\n\n**Interpretation:** _what this means for next steps_\n`,
      completion: [
        { description: "Provide experiment URL and screenshot", required: true },
        { description: "State metric, threshold, and result", required: true },
      ],
      evidence: "url",
      resources: [
        { label: "Landing page example", url: "https://example.org/eic/examples/landing", type: "example" },
        { label: "Survey question bank", url: "https://example.org/eic/resources/survey-bank", type: "doc" },
      ],
    },

    {
      id: "p2-t6-micro-quiz",
      order: 6,
      type: "assignment",
      title: "Micro‑Quiz: Interviews, Metrics, and Bias",
      summary: "Quick knowledge check before you submit your report.",
      details_md: `Score ≥70% to pass.`,
      estimated_minutes: 8,
      xp: 50,
      completion: [{ description: "Score ≥70% on quiz", required: true }],
      evidence: "quiz",
      quiz: {
        passing_score: 70,
        questions: [
          {
            id: "q1",
            prompt: "Which is a *vanity* metric?",
            options: [
              "Number of qualified sign‑ups",
              "Percentage of interviewees reporting the pain in the last 2 weeks",
              "Total page views with no CTA",
              "Number of respondents meeting your target persona",
            ],
            answer_index: 2,
            explanation: "Page views without intent signal often don't correlate with value.",
          },
          {
            id: "q2",
            prompt: "During problem interviews you should…",
            options: [
              "Pitch your solution to get feedback",
              "Ask about recent real experiences and costs",
              "Ask if they'd buy today",
              "Demo your prototype",
            ],
            answer_index: 1,
            explanation: "Problem interviews seek stories and specifics, not pitches.",
          },
          {
            id: "q3",
            prompt: "A good hypothesis includes…",
            options: [
              "An exact UI mockup",
              "A metric, a threshold, and a time window",
              "Your preferred tech stack",
              "A list of 10 features",
            ],
            answer_index: 1,
            explanation: "Testable hypotheses specify metric, threshold, and when you'll measure it.",
          },
        ],
      },
    },

    {
      id: "p2-t7-validation-report",
      order: 7,
      type: "submission",
      title: "Submit Validation Report (Unlocks Phase 3)",
      summary: "Combine interviews + experiment into a concise report with a go/no‑go/adjust decision.",
      details_md: `\nYour report should include:\n1) Hypothesis & metric, 2) Interview method & key quotes, 3) Synthesis insights, 4) Experiment setup & results, 5) Decision: proceed, pivot, or pause, 6) Risks to address in Phase 3.\n`,
      estimated_minutes: 45,
      xp: 150,
      template_md: `\n# Validation Report\n\n**Hypothesis & Metric:**\n\n**Interview Summary (3–5):**\n- Pattern 1 / quote\n- Pattern 2 / quote\n- Pattern 3 / quote\n\n**Experiment Result:** _metric vs threshold_\n\n**Decision:** _proceed | adjust | pivot | pause (why)_\n\n**Next Risks for Phase 3:**\n- \n- \n`,
      completion: [
        { description: "Upload final report (PDF/Doc)", required: true },
      ],
      evidence: "file",
      rubric: [
        {
          criterion: "Strength of evidence vs. hypothesis",
          levels: [
            { label: "Basic", description: "Anecdotes; unclear metric", points: 10 },
            { label: "Proficient", description: "Clear metric; some quantified evidence", points: 20 },
            { label: "Excellent", description: "Compelling quantified evidence & clear call", points: 30 },
          ],
        },
        {
          criterion: "Clarity of next‑phase risks",
          levels: [
            { label: "Basic", description: "Generic or missing", points: 10 },
            { label: "Proficient", description: "Specific and actionable", points: 20 },
            { label: "Excellent", description: "Prioritized with rationale", points: 30 },
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
