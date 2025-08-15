// EIC Pathway – Phase 4 (EIC Deep Dive) Plug‑and‑Play Module
// Drop-in TypeScript data module for your web app.
// Mirrors the Phase 1–3 structure with ≤7 tasks, XP, templates, and a code‑gate unlock to Phase 5.

// -----------------
// Types & Interfaces (standalone for easy import)
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
// Phase 4 Content
// -----------------
const INTRO = `
**Goal:** Understand the Entrepreneurship Innovation Center (EIC) at Bowie State University deeply enough to leverage its people, programs, spaces, and events for your venture.\n\n
**What you'll do**\n- Explore official EIC resources (website, events, programs, makerspace).\n- Identify staff, mentors, and programs aligned to your project.\n- Engage in at least one EIC event and visit the EIC in person.\n- Produce an EIC Deep Dive Report for staff review to unlock Phase 5.\n\n**Estimated time:** ~3–5 hours depending on engagement.\n`;

export const Phase4EICDeepDive: PhaseDefinition = {
  id: "phase-4-eic-deep-dive",
  title: "Phase 4: EIC Deep Dive",
  goal: "Map how the EIC can accelerate your idea through people, programs, spaces, and events.",
  intro_md: INTRO,
  unlock: {
    kind: "code_gate",
    code_hint: "Bring your approved Deep Dive Report to the EIC desk to receive the unlock code for Phase 5.",
  },
  tasks: [
    {
      id: "p4-t1-eic-intro-video",
      order: 1,
      type: "video",
      title: "Welcome to BSU's Entrepreneurship Innovation Center",
      summary: "Watch an intro video and capture key takeaways about EIC's mission and impact.",
      details_md: `\nWrite **3 takeaways** you learned about how the EIC supports student entrepreneurs across majors.`,
      estimated_minutes: 10,
      xp: 50,
      resources: [
        { label: "EIC intro video (YouTube)", url: "https://www.youtube.com/watch?v=BxaSGQZ1UDA", type: "video" },
      ],
      completion: [
        { description: "Submit 3 bullet takeaways", required: true },
      ],
      evidence: "text",
    },

    {
      id: "p4-t2-resource-map",
      order: 2,
      type: "research",
      title: "EIC Website Exploration & Resource Map",
      summary: "Explore official EIC pages and catalog programs, events, spaces, and contact points.",
      details_md: `\nVisit the EIC website and subpages below. Create a **Resource Map** listing each item, what it offers, who it's for, and an action step you could take.`,
      estimated_minutes: 35,
      xp: 110,
      resources: [
        { label: "EIC main page", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/", type: "external" },
        { label: "Events", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/events/", type: "external" },
        { label: "Makerspace", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/makerspace/", type: "external" },
        { label: "Entrepreneurs in Residence (EiR)", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/for-students/entrepreneurs-in-residence.php", type: "external" },
        { label: "Summer Launch Program (SLP)", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/for-students/summer-launch-program/", type: "external" },
        { label: "ELLC (Entrepreneurship Living Learning Community)", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/for-students/explore-the-ellc.php", type: "external" },
        { label: "Contact EIC", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/contact-us.php", type: "external" },
      ],
      template_md: `\n# EIC Resource Map\n\n| Resource | What it Offers | Who It's For | Link | Your Action Step |\n|---|---|---|---|---|\n| Events | Networking, workshops | Students & community | (URL) | Register for ___ |\n| Makerspace | Prototyping, tools (safety training req.) | BSU students/faculty/staff | (URL) | Book safety training |\n| EiR | Mentorship from entrepreneurs | Students | (URL) | Request office hours with ___ |\n| Summer Launch Program | 9-week paid incubator | Student teams | (URL) | Draft application |\n| ELLC | Residential innovation hub | Students in ELLC | (URL) | Tour ELLC |\n| Contact | Email for inquiries | Anyone | (URL) | Email question about ___ |\n`,
      completion: [
        { description: "Upload completed Resource Map (PDF/Doc)", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p4-t3-staff-eir-spotlight",
      order: 3,
      type: "assignment",
      title: "Staff & EiR Spotlight (Pick Two)",
      summary: "Research two EIC leaders or Entrepreneurs‑in‑Residence and explain how they could help your venture.",
      details_md: `\nWrite **two short bios (3–5 sentences each)** and add a note on how you'd engage them (ask for office hours, feedback, or connections).`,
      estimated_minutes: 25,
      xp: 90,
      resources: [
        { label: "Entrepreneurs in Residence", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/for-students/entrepreneurs-in-residence.php", type: "external" },
        { label: "Executive Director contact", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/partner-with-us/i-corps/contact-us.php", type: "external" },
      ],
      template_md: `\n# Staff & EiR Spotlight\n\n**Person 1:** Name & role\n- Bio (3–5 sentences)\n- How they could help my venture\n- Outreach plan (email, event, office hours)\n\n**Person 2:** Name & role\n- Bio (3–5 sentences)\n- How they could help my venture\n- Outreach plan (email, event, office hours)\n`,
      completion: [
        { description: "Upload spotlight write‑ups (PDF/Doc)", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p4-t4-program-match",
      order: 4,
      type: "exercise",
      title: "Program Match & Action Plan",
      summary: "Choose two EIC programs/resources and describe exactly how you'll use them in the next 30 days.",
      details_md: `\nExamples include the **Summer Launch Program**, **Makerspace**, **EiR office hours**, **ELLC**, or student business supports like the **Student Business Hatchery**.`,
      estimated_minutes: 30,
      xp: 100,
      resources: [
        { label: "Summer Launch Program (SLP)", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/for-students/summer-launch-program/", type: "external" },
        { label: "Makerspace", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/makerspace/", type: "external" },
        { label: "Student Business Hatchery (overview)", url: "https://bowiestate.edu/academics/colleges/college-of-business/departments/management-marketing-and-public-administration/programs/entrepreneurship-small-busines/special-opportunities.php", type: "external" },
      ],
      template_md: `\n# Program Match Plan (2 picks)\n\n**Program 1:** _name_\n- Why it's a fit for my current stage\n- Concrete steps in next 30 days (3 bullets)\n- Expected outcome/metric\n\n**Program 2:** _name_\n- Why it's a fit for my current stage\n- Concrete steps in next 30 days (3 bullets)\n- Expected outcome/metric\n`,
      completion: [
        { description: "Upload 2‑program action plan", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p4-t5-event-engagement",
      order: 5,
      type: "assignment",
      title: "Attend an EIC Event (or Watch a Recording)",
      summary: "Engage with the EIC community via a live event or recorded session; reflect on value to your venture.",
      details_md: `\nRegister for an upcoming EIC event **or** locate a past/recorded session. Submit a short reflection (150–250 words) on what you learned and one action you'll take.`,
      estimated_minutes: 45,
      xp: 110,
      resources: [
        { label: "EIC Events (official)", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/events/", type: "external" },
        { label: "EIC Events on TheYard", url: "https://theyard.bowiestate.edu/eic/events/", type: "external" },
      ],
      template_md: `\n# Event Reflection\n\n**Event Title & Date:**\n\n**Key Takeaway (3 bullets):**\n-\n-\n-\n\n**Action I will take this week:**\n`,
      completion: [
        { description: "Upload reflection (PDF/Doc) and include a URL or screenshot for proof", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p4-t6-inperson-visit",
      order: 6,
      type: "exercise",
      title: "Visit the EIC & (Optional) Book Makerspace Safety Training",
      summary: "Visit the EIC in person; if relevant, plan Makerspace safety training. Provide proof of visit.",
      details_md: `\nStop by the EIC on campus. If prototyping is relevant, review Makerspace safety requirements and plan your training. Submit a photo at the EIC or a staff signature/confirmation email.`,
      estimated_minutes: 30,
      xp: 90,
      resources: [
        { label: "Contact EIC (email)", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/contact-us.php", type: "external" },
        { label: "Makerspace (safety training info)", url: "https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/makerspace/", type: "external" },
      ],
      template_md: `\n# Visit Proof\n\n**Date of Visit:**\n\n**Who I met / spoke with (optional):**\n\n**Photo or Signature/Email Confirmation:** _attach_\n\n**Next Step I will take after this visit:**\n`,
      completion: [
        { description: "Upload visit proof (photo/signature/email screenshot)", required: true },
      ],
      evidence: "file",
    },

    {
      id: "p4-t7-deep-dive-report",
      order: 7,
      type: "submission",
      title: "Submit EIC Deep Dive Report (Unlocks Phase 5)",
      summary: "Combine your exploration and engagement into a concise report with concrete next steps.",
      details_md: `\nYour report should include: (1) Mission & key takeaways, (2) Resource Map, (3) Staff/EiR spotlights, (4) Program Match Plan, (5) Event reflection, (6) Visit proof, (7) Next steps to engage EIC in Phase 5.`,
      estimated_minutes: 40,
      xp: 150,
      template_md: `\n# EIC Deep Dive Report\n\n**Mission & Takeaways (≤150 words):**\n\n**Resource Map (summary):** _attach full map_\n\n**Staff/EiR Spotlights:**\n- Person 1 — how they'll help\n- Person 2 — how they'll help\n\n**Program Match Plan (2 picks):**\n\n**Event Reflection:**\n\n**Visit Proof:**\n\n**Next Steps for Phase 5:**\n-\n-\n-\n`,
      completion: [
        { description: "Upload final report (PDF/Doc)", required: true },
      ],
      evidence: "file",
      rubric: [
        {
          criterion: "Completeness of exploration & engagement",
          levels: [
            { label: "Basic", description: "Most sections present; limited detail", points: 10 },
            { label: "Proficient", description: "All sections covered with specifics", points: 20 },
            { label: "Excellent", description: "Thorough, actionable, clearly tied to venture", points: 30 },
          ],
        },
        {
          criterion: "Actionability of next steps",
          levels: [
            { label: "Basic", description: "General intentions", points: 10 },
            { label: "Proficient", description: "Specific steps with owners & dates", points: 20 },
            { label: "Excellent", description: "Clear roadmap with metrics", points: 30 },
          ],
        },
      ],
    },
  ],
  get xp_total() {
    return this.tasks.reduce((s, t) => s + t.xp, 0);
  },
} as unknown as PhaseDefinition;

// Helpers (optional)
export function getPhaseXP(phase: PhaseDefinition): number {
  return phase.tasks.reduce((sum, t) => sum + t.xp, 0);
}

export function isPhaseComplete(
  phase: PhaseDefinition,
  taskStatuses: Record<string, { completed: boolean }>
): boolean {
  return phase.tasks.every((t) => taskStatuses[t.id]?.completed);
}
