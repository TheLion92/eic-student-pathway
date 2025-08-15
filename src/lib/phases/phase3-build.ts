// EIC Pathway – Phase 3 (Build) Plug‑and‑Play Module
// Drop-in TypeScript data module for your web app.
// Follows the shared schema (PhaseDefinition/Task) used in Phase 1–2.
// ≤7 tasks, XP system, templates, and code‑gate unlock to Phase 4.

const INTRO = `
**Goal:** Build a scrappy, testable MVP that lets a real user complete the core job end‑to‑end.\n\n
**What you'll do**\n- Define a razor‑thin MVP scope and acceptance criteria.\n- Design the core user flow (wireframes) and a minimal data model.\n- Choose tech, de‑risk risks, and plan the work.\n- Ship a V0, test with users, and iterate to V1.\n- Submit a short demo for staff review to unlock Phase 4 (EIC Resources).\n\n**Estimated time:** ~6–10 hours depending on stack and complexity.\n`;

export const Phase3Build = {
  id: "phase-3-build",
  title: "Phase 3: Build",
  goal: "Ship a minimal, working MVP that proves a user can accomplish the core task.",
  intro_md: INTRO,
  unlock: {
    kind: "code_gate",
    code_hint: "Bring your approved MVP demo link to the EIC desk to receive the unlock code for Phase 4.",
  },
  tasks: [
    {
      id: "p3-t1-mvp-scope",
      order: 1,
      type: "exercise",
      title: "Define MVP Scope & Acceptance Criteria",
      summary: "Write a tight MVP objective, primary user story, and success criteria tied to Phase 2 findings.",
      details_md:
        "Use the template to define one must‑have user story and 3–5 acceptance criteria. Keep scope razor‑thin.",
      estimated_minutes: 30,
      xp: 90,
      evidence: "file",
      template_md: `\n# MVP Scope\n\n**Objective (1 sentence):** _What the MVP proves_\n\n**Primary User Story:**\n_As a [persona], I want to [action], so that [outcome]._\n\n**Acceptance Criteria (3–5):**\n- [ ] A user can…\n- [ ] …\n- [ ] …\n\n**Out of Scope (for now):**\n- \n- \n`,
      completion: [
        { description: "Upload scope with 3–5 acceptance criteria", required: true },
      ],
    },
    {
      id: "p3-t2-design-flow",
      order: 2,
      type: "exercise",
      title: "Core Flow Wireframes & Data Model Sketch",
      summary: "Create low‑fi wireframes of the end‑to‑end MVP flow and a minimal entity diagram (tables/collections).",
      details_md:
        "Focus on the happy path only. Include 3–6 frames and 2–4 core entities with key fields.",
      estimated_minutes: 45,
      xp: 110,
      evidence: "file",
      template_md: `\n# Design Pack\n\n**Screens (3–6):** _Attach images or a single PDF_\n\n**Entities:**\n- Entity: fields\n- Entity: fields\n\n**Notes:** _critical states, constraints_\n`,
      resources: [
        { label: "Wireframing primer (article)", url: "https://example.org/eic/resources/wireframes", type: "external" },
      ],
      completion: [
        { description: "Upload wireframes and entity sketch", required: true },
      ],
    },
    {
      id: "p3-t3-tech-plan",
      order: 3,
      type: "assignment",
      title: "Tech Plan: Stack, Risks, and Work Board",
      summary: "Choose stack, list top risks, and create a small Kanban with 6–12 tasks.",
      details_md:
        "Name your stack (frontend, backend, DB, hosting). Call out 2–3 risks (e.g., auth, data model, performance) and how you'll mitigate them. Create a public/ sharable board.",
      estimated_minutes: 35,
      xp: 90,
      evidence: "url",
      template_md: `\n# Tech Plan\n\n**Stack:** _frontend / backend / DB / hosting_\n\n**Top Risks & Mitigations:**\n1. Risk → plan\n2. Risk → plan\n3. Risk → plan\n\n**Kanban Link:** _Backlog/Doing/Done with 6–12 cards_\n`,
      resources: [
        { label: "Example Kanban (public template)", url: "https://example.org/eic/examples/kanban", type: "example" },
      ],
      completion: [
        { description: "Provide sharable Kanban link and risk list", required: true },
      ],
    },
    {
      id: "p3-t4-build-v0",
      order: 4,
      type: "assignment",
      title: "Ship V0 of the MVP",
      summary: "Build the happy‑path flow that meets the acceptance criteria. Deploy to a public URL.",
      details_md:
        "Push code to a repo and deploy (e.g., Netlify, Vercel, Render). Screens may be ugly—functionality first.",
      estimated_minutes: 120,
      xp: 150,
      evidence: "url",
      completion: [
        { description: "Link to live app (public URL)", required: true },
        { description: "Link to repository (read‑only)", required: true },
      ],
    },
    {
      id: "p3-t5-user-tests",
      order: 5,
      type: "experiment",
      title: "Run 3 Usability Tests",
      summary: "Observe 3 target users completing the primary task. Capture issues and time to complete.",
      details_md:
        "Use the script. Do not help unless they are stuck for 60s. Record completion rate and top issues.",
      estimated_minutes: 60,
      xp: 120,
      evidence: "file",
      template_md: `\n# Usability Test Log (3 participants)\n\n**Task:** _primary user story_\n\n| Participant | Time to Complete | Completed? | Top Issues Observed |\n|---|---|---|---|\n| P1 | | | |\n| P2 | | | |\n| P3 | | | |\n\n**Top 5 Issues (ranked):**\n1.\n2.\n3.\n4.\n5.\n`,
      resources: [
        { label: "Usability test script (one‑pager)", url: "https://example.org/eic/guides/usability", type: "doc" },
      ],
      completion: [
        { description: "Upload completed test log", required: true },
      ],
    },
    {
      id: "p3-t6-iterate-v1",
      order: 6,
      type: "exercise",
      title: "Iterate to V1 (Fix Top Issues)",
      summary: "Address the top 3 issues and document changes. Re‑test with at least 1 participant.",
      details_md:
        "Prioritize impact over effort. Update the Kanban and produce a short changelog.",
      estimated_minutes: 45,
      xp: 110,
      evidence: "file",
      template_md: `\n# V1 Changelog\n\n**Issues Addressed:**\n1. _what changed & why_\n2. _what changed & why_\n3. _what changed & why_\n\n**Re‑test Result (1+ participant):** _notes/metrics_\n`,
      completion: [
        { description: "Upload changelog and re‑test note", required: true },
      ],
    },
    {
      id: "p3-t7-demo",
      order: 7,
      type: "submission",
      title: "Submit MVP Demo (Unlocks Phase 4)",
      summary: "Record a 3–5 minute screen‑share demo showing the happy path and how you addressed user feedback.",
      details_md:
        "Include: (1) problem recap (30s), (2) user story, (3) end‑to‑end flow, (4) what you learned from tests, (5) what you would do next.",
      estimated_minutes: 40,
      xp: 160,
      evidence: "url",
      template_md: `\n# Demo Submission\n\n**Video Link:**\n\n**Live App URL:**\n\n**Repo URL:**\n\n**Notes for Reviewers (optional):**\n-\n-\n`,
      rubric: [
        {
          criterion: "MVP completeness vs acceptance criteria",
          levels: [
            { label: "Basic", description: "Partial flow works", points: 10 },
            { label: "Proficient", description: "Happy path complete", points: 20 },
            { label: "Excellent", description: "Polished happy path + metrics from tests", points: 30 },
          ],
        },
        {
          criterion: "Evidence of iteration from user tests",
          levels: [
            { label: "Basic", description: "Mentions issues", points: 10 },
            { label: "Proficient", description: "Fixes top issues", points: 20 },
            { label: "Excellent", description: "Shows measurable improvement", points: 30 },
          ],
        },
      ],
      completion: [
        { description: "Provide video + live app + repo URLs", required: true },
      ],
    },
  ],
  get xp_total() {
    return this.tasks.reduce((sum, t) => sum + t.xp, 0);
  },
};
