import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

export type AssessmentLevel = "beginner" | "intermediate" | "advanced";

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
    points: number;
    phaseHint: number; // Which phase this suggests they might be ready for
  }[];
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What's your current entrepreneurial experience level?",
    options: [
      { value: "none", label: "Complete beginner - I'm just starting to think about entrepreneurship", points: 1, phaseHint: 1 },
      { value: "basic", label: "Basic - I've had some ideas but never acted on them", points: 2, phaseHint: 1 },
      { value: "some", label: "Some experience - I've started projects or done some research", points: 3, phaseHint: 2 },
      { value: "experienced", label: "Experienced - I've built and tested several ideas", points: 4, phaseHint: 3 },
    ],
  },
  {
    id: 2,
    question: "Do you have a specific business idea or problem you want to solve?",
    options: [
      { value: "no", label: "No - I'm still exploring and learning", points: 1, phaseHint: 1 },
      { value: "maybe", label: "Maybe - I have some thoughts but nothing concrete", points: 2, phaseHint: 1 },
      { value: "yes", label: "Yes - I have a clear idea I want to validate", points: 3, phaseHint: 2 },
      { value: "validated", label: "Yes - I've already validated it with some research", points: 4, phaseHint: 3 },
    ],
  },
  {
    id: 3,
    question: "Have you ever talked to potential customers about their problems?",
    options: [
      { value: "never", label: "Never - I don't know how to approach people", points: 1, phaseHint: 1 },
      { value: "friends", label: "Only friends and family", points: 2, phaseHint: 1 },
      { value: "some", label: "Some strangers - basic customer interviews", points: 3, phaseHint: 2 },
      { value: "extensive", label: "Extensive customer research and interviews", points: 4, phaseHint: 3 },
    ],
  },
  {
    id: 4,
    question: "How familiar are you with business model concepts?",
    options: [
      { value: "unfamiliar", label: "Unfamiliar - I'm learning the basics", points: 1, phaseHint: 1 },
      { value: "basic", label: "Basic understanding - I know some terms", points: 2, phaseHint: 1 },
      { value: "intermediate", label: "Intermediate - I can explain business models", points: 3, phaseHint: 2 },
      { value: "advanced", label: "Advanced - I've worked with business models", points: 4, phaseHint: 3 },
    ],
  },
  {
    id: 5,
    question: "Have you ever built a prototype or MVP of something?",
    options: [
      { value: "never", label: "Never - I don't know where to start", points: 1, phaseHint: 1 },
      { value: "thought", label: "I've thought about it but haven't built anything", points: 2, phaseHint: 1 },
      { value: "basic", label: "Basic prototypes - sketches, mockups, simple demos", points: 3, phaseHint: 2 },
      { value: "working", label: "Working prototypes or MVPs that people can use", points: 4, phaseHint: 3 },
    ],
  },
  {
    id: 6,
    question: "How comfortable are you with pitching ideas to others?",
    options: [
      { value: "uncomfortable", label: "Very uncomfortable - I get nervous", points: 1, phaseHint: 1 },
      { value: "somewhat", label: "Somewhat comfortable - I can do it with practice", points: 2, phaseHint: 2 },
      { value: "comfortable", label: "Comfortable - I can pitch to most audiences", points: 3, phaseHint: 3 },
      { value: "confident", label: "Very confident - I regularly pitch to investors/customers", points: 4, phaseHint: 4 },
    ],
  },
  {
    id: 7,
    question: "What's your experience with market research and validation?",
    options: [
      { value: "none", label: "None - I'm learning about this", points: 1, phaseHint: 1 },
      { value: "basic", label: "Basic - I've done some online research", points: 2, phaseHint: 1 },
      { value: "intermediate", label: "Intermediate - I've done surveys and some interviews", points: 3, phaseHint: 2 },
      { value: "advanced", label: "Advanced - I've done comprehensive market validation", points: 4, phaseHint: 3 },
    ],
  },
  {
    id: 8,
    question: "How much time can you realistically dedicate to this pathway each week?",
    options: [
      { value: "1-2", label: "1-2 hours - I'm very busy", points: 1, phaseHint: 1 },
      { value: "3-5", label: "3-5 hours - I can make some time", points: 2, phaseHint: 1 },
      { value: "6-10", label: "6-10 hours - I can dedicate significant time", points: 3, phaseHint: 2 },
      { value: "10+", label: "10+ hours - I'm fully committed", points: 4, phaseHint: 3 },
    ],
  },
];

interface LevelAssessmentProps {
  onComplete: (level: AssessmentLevel, recommendedPhase: number) => void;
  onSkip?: () => void;
}

const LevelAssessment = ({ onComplete, onSkip }: LevelAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;
  const currentQuestionData = ASSESSMENT_QUESTIONS[currentQuestion];

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionData.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    const totalPoints = Object.values(answers).reduce((sum, answerValue) => {
      const question = ASSESSMENT_QUESTIONS.find(q => 
        q.options.some(opt => opt.value === answerValue)
      );
      const option = question?.options.find(opt => opt.value === answerValue);
      return sum + (option?.points || 0);
    }, 0);

    // Calculate recommended phase based on answers
    const phaseHints = Object.values(answers).map(answerValue => {
      const question = ASSESSMENT_QUESTIONS.find(q => 
        q.options.some(opt => opt.value === answerValue)
      );
      const option = question?.options.find(opt => opt.value === answerValue);
      return option?.phaseHint || 1;
    });
    
    // Get the most common phase hint, or default to 1
    const phaseCounts = phaseHints.reduce((acc, phase) => {
      acc[phase] = (acc[phase] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const recommendedPhase = Object.entries(phaseCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 1;

    let level: AssessmentLevel;
    if (totalPoints <= 16) {
      level = "beginner";
    } else if (totalPoints <= 24) {
      level = "intermediate";
    } else {
      level = "advanced";
    }

    setIsCompleted(true);
    
    const phaseNames = ["", "Ideation", "Validation", "Build", "EIC Deep Dive", "Launch & Pitch"];
    const phaseName = phaseNames[parseInt(recommendedPhase.toString())];
    
    toast({
      title: "Assessment Complete! 🎯",
      description: `Based on your experience, we recommend starting at Phase ${recommendedPhase}: ${phaseName}`,
    });
    
    // Small delay to show the completion message before redirecting
    setTimeout(() => onComplete(level, parseInt(recommendedPhase.toString())), 2000);
  };

  const canProceed = answers[currentQuestionData.id];

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              Assessment Complete! 🎉
            </h3>
            <p className="text-muted-foreground">
              Analyzing your responses and placing you in the right phase...
            </p>
            <div className="mt-4">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl mb-2">Welcome to the EIC Pathway! 🚀</CardTitle>
        <p className="text-muted-foreground">
          Let's understand your entrepreneurial experience to place you in the right starting phase
        </p>
        <Progress value={progress} className="mt-4" />
        <p className="text-sm text-muted-foreground mt-2">
          Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {currentQuestionData.question}
          </h3>
          
          <RadioGroup
            value={answers[currentQuestionData.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestionData.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`q${currentQuestionData.id}-${option.value}`} />
                <Label htmlFor={`q${currentQuestionData.id}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {currentQuestion > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {onSkip && (
              <Button variant="ghost" onClick={onSkip}>
                Skip Assessment
              </Button>
            )}
          </div>
          
          <Button 
            onClick={handleNext} 
            disabled={!canProceed}
            className="min-w-[100px]"
          >
            {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelAssessment;
