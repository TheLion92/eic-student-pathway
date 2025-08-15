import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Phase4EICDeepDive } from "@/lib/phases/phase4-eic-deep-dive";
import { ChevronDown, ChevronRight, CheckCircle, ExternalLink, Download, Video, Users, FileText, MapPin, Calendar } from "lucide-react";

interface TaskStatus {
  completed: boolean;
  evidence?: string;
}

interface Phase4EICDeepDiveProps {
  onComplete: () => void;
}

const Phase4EICDeepDiveView = ({ onComplete }: Phase4EICDeepDiveProps) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});

  const completedTasks = Object.values(taskStatuses).filter(status => status.completed).length;
  const totalXP = Phase4EICDeepDive.tasks.reduce((sum, task) => sum + task.xp, 0);
  const earnedXP = Phase4EICDeepDive.tasks.reduce((sum, task) => 
    sum + (taskStatuses[task.id]?.completed ? task.xp : 0), 0
  );
  const progress = (completedTasks / Phase4EICDeepDive.tasks.length) * 100;

  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const markTaskComplete = (taskId: string) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], completed: !prev[taskId]?.completed }
    }));
    
    const task = Phase4EICDeepDive.tasks.find(t => t.id === taskId);
    if (task && !taskStatuses[taskId]?.completed) {
      toast({
        title: "Task Completed! 🎉",
        description: `Great job! You earned ${task.xp} XP for "${task.title}"`,
      });
    }
  };

  const getTaskIcon = (task: any) => {
    switch (task.type) {
      case "video": return <Video className="w-4 h-4" />;
      case "exercise": return <Download className="w-4 h-4" />;
      case "assignment": return <FileText className="w-4 h-4" />;
      case "peer_review": return <Users className="w-4 h-4" />;
      case "research": return <MapPin className="w-4 h-4" />;
      case "experiment": return <Calendar className="w-4 h-4" />;
      case "submission": return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTaskTypeColor = (task: any) => {
    switch (task.type) {
      case "video": return "bg-blue-100 text-blue-800";
      case "exercise": return "bg-green-100 text-green-800";
      case "assignment": return "bg-purple-100 text-purple-800";
      case "peer_review": return "bg-orange-100 text-orange-800";
      case "research": return "bg-indigo-100 text-indigo-800";
      case "experiment": return "bg-pink-100 text-pink-800";
      case "submission": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isPhaseReady = Phase4EICDeepDive.tasks.every((t) => taskStatuses[t.id]?.completed);

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge className="bg-emerald-600 text-white text-sm font-medium">
              Phase 4
            </Badge>
            <span className="text-3xl font-bold text-gray-900">{Phase4EICDeepDive.title}</span>
          </div>
          <p className="text-lg text-gray-700 mb-4">{Phase4EICDeepDive.goal}</p>
          <div className="bg-white p-4 rounded-lg border">
            <div className="prose prose-sm max-w-none text-left" 
                 dangerouslySetInnerHTML={{ __html: Phase4EICDeepDive.intro_md.replace(/\n/g, '<br/>') }} />
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
                {completedTasks} of {Phase4EICDeepDive.tasks.length} tasks completed
              </span>
              <div className="text-2xl font-bold text-emerald-600">
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
        {Phase4EICDeepDive.tasks.map((task) => {
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
                      <span className="text-emerald-600 font-semibold">{task.xp} XP</span>
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
                              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-colors"
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

                    {/* Rubric */}
                    {task.rubric && (
                      <div>
                        <h4 className="font-medium mb-2">Evaluation Rubric:</h4>
                        <div className="space-y-3">
                          {task.rubric.map((rubric, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <h5 className="font-medium mb-2">{rubric.criterion}</h5>
                              <div className="space-y-2">
                                {rubric.levels.map((level, levelIndex) => (
                                  <div key={levelIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div>
                                      <span className="font-medium">{level.label}:</span>
                                      <span className="text-sm text-gray-600 ml-2">{level.description}</span>
                                    </div>
                                    <Badge variant="outline">{level.points} pts</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
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
              🎉 Phase 4 Complete!
            </h3>
            <p className="text-green-700 mb-4">
              You've successfully completed all EIC Deep Dive tasks and earned {earnedXP} XP! 
              Visit the EIC to get your unlock code for Phase 5.
            </p>
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              Continue to Phase 5
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Phase4EICDeepDiveView;
