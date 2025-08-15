import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getUserEmail, logoutUser } from "@/lib/auth";
import { Link } from "react-router-dom";
import Phase2ValidationView from "@/components/Phase2Validation";
import Phase1IdeationView from "@/components/Phase1Ideation";
import Phase3BuildView from "@/components/Phase3Build";
import Phase4EICDeepDiveView from "@/components/Phase4EICDeepDive";
import Phase5LaunchPitchView from "@/components/Phase5LaunchPitch";

const QUOTES = [
  "The best way to predict the future is to create it.",
  "Ideas are easy. Execution is everything.",
  "Move fast, learn faster.",
  "Your network is your net worth.",
  "Small wins compound into big outcomes.",
];

const STAGES = [
  { id: 1, title: "Phase 1: Ideation", key: "EIC-1" },
  { id: 2, title: "Phase 2: Validation", key: "EIC-2" },
  { id: 3, title: "Phase 3: Build", key: "EIC-3" },
  { id: 4, title: "Phase 4: EIC Resources", key: "EIC-4" },
  { id: 5, title: "Phase 5: Launch", key: "EIC-5" },
];

type Progress = {
  completed: number[];
  unlocked: number[];
  assessmentLevel?: AssessmentLevel;
  phase2Completed?: boolean;
};

const getStorageKey = (email: string) => `eic-progress:${email}`;

const Pathway = () => {
  const email = getUserEmail()!;
  const location = useLocation();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [codes, setCodes] = useState<Record<number, string>>({});

  const [progress, setProgress] = useState<Progress>(() => {
    const raw = localStorage.getItem(getStorageKey(email));
    return raw ? (JSON.parse(raw) as Progress) : { completed: [], unlocked: [1] };
  });
  const [currentPhase, setCurrentPhase] = useState<number>(1);

  useEffect(() => {
    const id = setInterval(() => setQuoteIndex((i) => (i + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, []);

  // Handle assessment results from navigation state
  useEffect(() => {
    if (location.state?.assessmentCompleted) {
      const { level, recommendedPhase } = location.state;
      
      // Update progress based on assessment results
      const newUnlocked = [1]; // Always start with Phase 1 unlocked
      
      // If they're intermediate or advanced, unlock more phases
      if (level === "intermediate" && recommendedPhase >= 2) {
        newUnlocked.push(2);
      }
      if (level === "advanced" && recommendedPhase >= 3) {
        newUnlocked.push(2, 3);
      }
      
      setProgress(prev => ({
        ...prev,
        assessmentLevel: level,
        unlocked: newUnlocked
      }));
      
      // Set current phase to recommended phase (but ensure it's unlocked)
      const actualPhase = newUnlocked.includes(recommendedPhase) ? recommendedPhase : 1;
      setCurrentPhase(actualPhase);
      
      // Clear the navigation state
      window.history.replaceState({}, document.title);
      
      toast({
        title: "Welcome to the EIC Pathway! 🎯",
        description: `Based on your assessment, you're starting at Phase ${actualPhase}. You can always go back to earlier phases to review content.`,
      });
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(email), JSON.stringify(progress));
  }, [email, progress]);

  const currentUnlocked = useMemo(() => new Set(progress.unlocked), [progress]);
  const currentCompleted = useMemo(() => new Set(progress.completed), [progress]);

  const markComplete = (stageId: number) => {
    if (!currentUnlocked.has(stageId)) return;
    if (currentCompleted.has(stageId)) return;
    setProgress((p) => ({ ...p, completed: [...p.completed, stageId] }));
    toast({ title: "Great job!", description: "Stage completed. Visit the EIC to get your code." });
  };

  const submitCode = (stageId: number) => {
    const value = codes[stageId]?.trim();
    if (!value) return;
    // Placeholder: accepts EIC-<id>. In production, validate via Supabase.
    if (value.toUpperCase() === `EIC-${stageId}`) {
      const next = stageId + 1;
      setProgress((p) => ({
        completed: Array.from(new Set([...p.completed, stageId])),
        unlocked: Array.from(new Set([...p.unlocked, next])),
      }));
      toast({ title: "Unlocked!", description: `You can now access Phase ${next}.` });
    } else {
      toast({ title: "Incorrect code", description: "Please check with the EIC and try again." });
    }
  };



  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  return (
    <>
      <Helmet>
        <title>Pathway – EIC Student Journey</title>
        <meta
          name="description"
          content="Progress through 5 code-gated phases with motivational quotes and celebration toasts."
        />
        <link rel="canonical" href="/pathway" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'EIC Student Pathway',
            description: 'Five-phase entrepreneurship journey with code validation at the EIC.',
            provider: { '@type': 'CollegeOrUniversity', name: 'Bowie State University' },
          })}
        </script>
      </Helmet>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1)}!</h1>
            {progress.assessmentLevel && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">Level:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  progress.assessmentLevel === 'beginner' ? 'bg-blue-100 text-blue-800' :
                  progress.assessmentLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {progress.assessmentLevel.charAt(0).toUpperCase() + progress.assessmentLevel.slice(1)}
                </span>
              </div>
            )}
            <p className="text-muted-foreground">
              Motivation: "{QUOTES[quoteIndex]}"
            </p>
          </div>
          <div className="flex gap-3">
                        {progress.assessmentLevel && (
              <Link to="/assessment">
                <Button variant="outline">
                  Retake Assessment
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="outline">Home</Button>
            </Link>
            <Button onClick={handleLogout}>Sign out</Button>
          </div>
        </header>

        {/* Phase Content Display */}
        {currentPhase === 1 && currentUnlocked.has(1) && (
          <Phase1IdeationView 
            onComplete={() => {
              setCurrentPhase(2);
              markComplete(1);
            }} 
          />
        )}

        {currentPhase === 2 && currentUnlocked.has(2) && (
          <Phase2ValidationView 
            onComplete={() => {
              setCurrentPhase(3);
              markComplete(2);
            }} 
          />
        )}

        {currentPhase === 3 && currentUnlocked.has(3) && (
          <Phase3BuildView 
            onComplete={() => {
              setCurrentPhase(4);
              markComplete(3);
            }} 
          />
        )}

        {currentPhase === 4 && currentUnlocked.has(4) && (
          <Phase4EICDeepDiveView 
            onComplete={() => {
              setCurrentPhase(5);
              markComplete(4);
            }} 
          />
        )}

        {currentPhase === 5 && currentUnlocked.has(5) && (
          <Phase5LaunchPitchView 
            onComplete={() => {
              markComplete(5);
              toast({ 
                title: "🎉 Pathway Complete!", 
                description: "Congratulations! You've completed the entire EIC Pathway. Visit the EIC for your completion code and next steps." 
              });
            }} 
          />
        )}

        {/* Phase Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STAGES.map((s) => {
            const unlocked = currentUnlocked.has(s.id);
            const completed = currentCompleted.has(s.id);
            return (
              <Card key={s.id} className="h-full">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phase {s.id}</p>
                    <h2 className="text-xl font-semibold">{s.title}</h2>
                  </div>

                  {!unlocked && (
                    <p className="text-sm text-muted-foreground">Locked — complete previous phase first.</p>
                  )}

                  {unlocked && !completed && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Work through your tasks for this phase. When complete, mark it and visit the EIC to get your unlock code.
                      </p>
                      {s.id === 1 ? (
                        <Button onClick={() => setCurrentPhase(1)} className="w-full">Enter Phase 1</Button>
                      ) : s.id === 2 ? (
                        <Button onClick={() => setCurrentPhase(2)} className="w-full">Enter Phase 2</Button>
                      ) : s.id === 3 ? (
                        <Button onClick={() => setCurrentPhase(3)} className="w-full">Enter Phase 3</Button>
                      ) : s.id === 4 ? (
                        <Button onClick={() => setCurrentPhase(4)} className="w-full">Enter Phase 4</Button>
                      ) : s.id === 5 ? (
                        <Button onClick={() => setCurrentPhase(5)} className="w-full">Enter Phase 5</Button>
                      ) : (
                        <Button onClick={() => markComplete(s.id)} className="w-full">Mark phase complete</Button>
                      )}
                    </div>
                  )}

                  {unlocked && completed && s.id < 5 && (
                    <div className="space-y-3">
                      <Label htmlFor={`code-${s.id}`}>Enter EIC code to unlock next phase</Label>
                      <Input
                        id={`code-${s.id}`}
                        placeholder={`e.g., ${s.key}`}
                        value={codes[s.id] || ""}
                        onChange={(e) => setCodes({ ...codes, [s.id]: e.target.value })}
                      />
                      <Button onClick={() => submitCode(s.id)} className="w-full">Unlock next phase</Button>
                    </div>
                  )}

                  {s.id === 5 && completed && (
                    <p className="text-sm">Congratulations! You’ve reached Launch. The EIC team will guide your next steps.</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </>
  );
};

export default Pathway;
