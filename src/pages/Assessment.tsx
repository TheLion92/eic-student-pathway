import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import LevelAssessment, { AssessmentLevel } from "@/components/LevelAssessment";
import { getUserEmail, logoutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Assessment = () => {
  const navigate = useNavigate();
  const email = getUserEmail();
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
  }, [email, navigate]);

  const handleAssessmentComplete = (level: AssessmentLevel, recommendedPhase: number) => {
    setAssessmentCompleted(true);
    setRedirecting(true);
    
    // Store assessment results in localStorage
    const assessmentResults = {
      level,
      recommendedPhase,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(`eic-assessment:${email}`, JSON.stringify(assessmentResults));
    
    // Show completion message
    toast({
      title: "Assessment Complete! 🎯",
      description: `Based on your experience, you'll be placed in Phase ${recommendedPhase}. Redirecting you now...`,
    });
    
    // Redirect to pathway with assessment results
    setTimeout(() => {
      navigate("/pathway", { 
        state: { 
          assessmentCompleted: true,
          level,
          recommendedPhase 
        } 
      });
    }, 2000);
  };

  const handleSkipAssessment = () => {
    setAssessmentCompleted(true);
    setRedirecting(true);
    
    // Store default assessment results
    const assessmentResults = {
      level: "beginner" as AssessmentLevel,
      recommendedPhase: 1,
      completedAt: new Date().toISOString(),
      skipped: true,
    };
    localStorage.setItem(`eic-assessment:${email}`, JSON.stringify(assessmentResults));
    
    toast({
      title: "Starting at Phase 1",
      description: "You can always retake the assessment later from the pathway page.",
    });
    
    // Redirect to pathway
    setTimeout(() => {
      navigate("/pathway", { 
        state: { 
          assessmentCompleted: true,
          level: "beginner" as AssessmentLevel,
          recommendedPhase: 1 
        } 
      });
    }, 1500);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!email) {
    return null; // Will redirect to login
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {assessmentCompleted ? "Assessment Complete!" : "Redirecting..."}
          </h2>
          <p className="text-gray-600">
            {assessmentCompleted 
              ? "Preparing your personalized pathway..." 
              : "Please wait while we set up your account..."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>EIC Pathway Assessment</title>
        <meta
          name="description"
          content="Take the EIC Pathway assessment to find your optimal starting phase based on your entrepreneurial experience."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" className="text-lg font-bold text-orange-600">
                    EIC Pathway
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-600">Welcome, {email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1)}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to the EIC Pathway! 🚀
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let's understand your entrepreneurial experience to place you in the right starting phase. 
              This assessment will help us create a personalized learning journey just for you.
            </p>
          </div>

          {/* Assessment Component */}
          <LevelAssessment 
            onComplete={handleAssessmentComplete}
            onSkip={handleSkipAssessment}
          />

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                What to Expect After Assessment
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <div className="font-medium text-orange-600 mb-1">Phase 1: Ideation</div>
                  <p>Perfect for beginners starting their entrepreneurial journey</p>
                </div>
                <div>
                  <div className="font-medium text-blue-600 mb-1">Phase 2: Validation</div>
                  <p>For those with ideas ready to validate with customers</p>
                </div>
                <div>
                  <div className="font-medium text-purple-600 mb-1">Phase 3: Build</div>
                  <p>For experienced builders ready to create MVPs</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Assessment;
