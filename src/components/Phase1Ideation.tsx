import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Phase1Ideation, Task, isPhaseComplete } from "@/lib/phases/phase1-ideation";
import { ChevronDown, ChevronRight, Play, CheckCircle, Lock, ExternalLink, Download } from "lucide-react";

interface TaskStatus {
  completed: boolean;
  evidence?: string;
  quizScore?: number;
}

interface Phase1IdeationProps {
  onComplete: () => void;
}

const Phase1IdeationView = ({ onComplete }: Phase1IdeationProps) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, Record<string, number>>>({});

  const completedTasks = Object.values(taskStatuses).filter(status => status.completed).length;
  const totalXP = Phase1Ideation.tasks.reduce((sum, task) => sum + task.xp, 0);
  const earnedXP = Phase1Ideation.tasks.reduce((sum, task) => 
    sum + (taskStatuses[task.id]?.completed ? task.xp : 0), 0
  );
  const progress = (completedTasks / Phase1Ideation.tasks.length) * 100;

  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const markTaskComplete = (taskId: string) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], completed: !prev[taskId]?.completed }
    }));
    
    const task = Phase1Ideation.tasks.find(t => t.id === taskId);
    if (task && !taskStatuses[taskId]?.completed) {
      toast({
        title: "Task Completed! 🎉",
        description: `Great job! You earned ${task.xp} XP for "${task.title}"`,
      });
    }
  };

  const handleQuizAnswer = (taskId: string, questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], [questionId]: answerIndex }
    }));
  };

  const submitQuiz = (task: Task) => {
    if (!task.quiz) return;
    
    const answers = quizAnswers[task.id] || {};
    const correctAnswers = task.quiz.questions.filter(q => 
      answers[q.id] === q.answer_index
    ).length;
    const score = Math.round((correctAnswers / task.quiz.questions.length) * 100);
    
    if (score >= task.quiz.passing_score) {
      setTaskStatuses(prev => ({
        ...prev,
        [task.id]: { ...prev[task.id], completed: true, quizScore: score }
      }));
      toast({
        title: "Quiz Passed! 🎉",
        description: `You scored ${score}% and earned ${task.xp} XP!`,
      });
    } else {
      toast({
        title: "Quiz Failed",
        description: `You scored ${score}%. Need ${task.quiz.passing_score}% to pass. Try again!`,
        variant: "destructive",
      });
    }
  };

  const getTaskIcon = (task: Task) => {
    switch (task.type) {
      case "video": return <Play className="w-4 h-4" />;
      case "exercise": return <Download className="w-4 h-4" />;
      case "assignment": return <CheckCircle className="w-4 h-4" />;
      case "peer_review": return <ExternalLink className="w-4 h-4" />;
      case "research": return <ExternalLink className="w-4 h-4" />;
      case "submission": return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTaskTypeColor = (task: Task) => {
    switch (task.type) {
      case "video": return "bg-blue-100 text-blue-800";
      case "exercise": return "bg-green-100 text-green-800";
      case "assignment": return "bg-purple-100 text-purple-800";
      case "peer_review": return "bg-orange-100 text-orange-800";
      case "research": return "bg-indigo-100 text-indigo-800";
      case "submission": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isPhaseReady = isPhaseComplete(Phase1Ideation, taskStatuses);

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge className="bg-amber-600 text-white text-sm font-medium">
              Phase 1
            </Badge>
            <span className="text-3xl font-bold text-gray-900">{Phase1Ideation.title}</span>
          </div>
          <p className="text-lg text-gray-700 mb-4">{Phase1Ideation.goal}</p>
          <div className="bg-white p-4 rounded-lg border">
            <div className="prose prose-sm max-w-none text-left" 
                 dangerouslySetInnerHTML={{ __html: Phase1Ideation.intro_md.replace(/\n/g, '<br/>') }} />
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Progress Overview</h3>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">
                {completedTasks} of {Phase1Ideation.tasks.length} tasks completed
              </span>
              <div className="text-2xl font-bold text-amber-600">
                {earnedXP} / {totalXP} XP
              </div>
            </div>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete • {earnedXP} XP earned
          </p>
        </CardContent>
      </Card>

      {/* Tasks */}
      <div className="space-y-4">
        {Phase1Ideation.tasks.map((task) => {
          const isCompleted = taskStatuses[task.id]?.completed;
          const isExpanded = expandedTask === task.id;
          
          return (
            <Card key={task.id} className={`overflow-hidden ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getTaskIcon(task)}
                      <Badge className={`${getTaskTypeColor(task)} text-xs`}>
                        {task.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-amber-600 font-semibold">{task.xp} XP</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{task.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? "Completed" : "Pending"}
                    </Badge>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4 space-y-4">
                    {/* Task Details */}
                    <div className="prose prose-sm max-w-none" 
                         dangerouslySetInnerHTML={{ __html: task.details_md.replace(/\n/g, '<br/>') }} />
                    
                    {/* Resources */}
                    {task.resources && task.resources.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Resources:</h4>
                        <div className="flex flex-wrap gap-2">
                          {task.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {resource.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Template Download */}
                    {task.template_md && (
                      <div>
                        <h4 className="font-medium mb-2">Template:</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([task.template_md!], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${task.title.replace(/\s+/g, '-')}-template.md`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      </div>
                    )}

                    {/* Quiz */}
                    {task.quiz && (
                      <div>
                        <h4 className="font-medium mb-2">Quiz ({task.quiz.passing_score}% to pass):</h4>
                        <div className="space-y-3">
                          {task.quiz.questions.map((question) => (
                            <div key={question.id} className="border rounded-lg p-3">
                              <p className="font-medium mb-2">{question.prompt}</p>
                              <div className="space-y-2">
                                {question.options.map((option, index) => (
                                  <label key={index} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`quiz-${task.id}-${question.id}`}
                                      value={index}
                                      checked={quizAnswers[task.id]?.[question.id] === index}
                                      onChange={() => handleQuizAnswer(task.id, question.id, index)}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm">{option}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Button
                            onClick={() => submitQuiz(task)}
                            disabled={!task.quiz?.questions.every(q => quizAnswers[task.id]?.[q.id] !== undefined)}
                            className="w-full"
                          >
                            Submit Quiz
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Completion Criteria */}
                    <div>
                      <h4 className="font-medium mb-2">Completion Requirements:</h4>
                      <ul className="space-y-1">
                        {task.completion.map((criterion, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${criterion.required ? 'text-green-600' : 'text-blue-600'}`} />
                            <span className="text-sm">
                              {criterion.description}
                              {!criterion.required && <Badge variant="outline" className="ml-2">Bonus</Badge>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Task Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => markTaskComplete(task.id)}
                        variant={isCompleted ? "outline" : "default"}
                        className="flex-1"
                      >
                        {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Phase Completion */}
      {isPhaseReady && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              🎉 Phase 1 Complete!
            </h3>
            <p className="text-green-700 mb-4">
              You've successfully completed all ideation tasks and earned {earnedXP} XP! 
              Visit the EIC to get your unlock code for Phase 2.
            </p>
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              Continue to Phase 2
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Phase1IdeationView;
