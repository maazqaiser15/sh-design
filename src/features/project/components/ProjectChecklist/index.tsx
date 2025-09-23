import React from 'react';
import { CheckCircle, Circle, ArrowRight, Settings, Wrench, Search, CheckCircle2 } from 'lucide-react';
import { ChecklistItem } from '../../types/projectDetails';

interface ProjectChecklistProps {
  checklist: ChecklistItem[];
  onToggleItem: (itemId: string) => void;
}

/**
 * ProjectChecklist - Multi-stage workflow checklist
 * Shows project stages: Preparation > Work in Progress > Quality Check > Completed
 */
export const ProjectChecklist: React.FC<ProjectChecklistProps> = ({
  checklist,
  onToggleItem
}) => {
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  // Define the project stages with icons
  const projectStages = [
    { id: 'preparation', label: 'Preparation', icon: Settings, completed: completedCount === totalCount },
    { id: 'wip', label: 'Work in Progress', icon: Wrench, completed: false },
    { id: 'quality', label: 'Quality Check', icon: Search, completed: false },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, completed: false }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Project Workflow</h3>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Project Stages with Arrows */}
      <div className="flex items-center justify-between mb-4">
        {projectStages.map((stage, index) => {
          const IconComponent = stage.icon;
          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  stage.completed 
                    ? 'bg-green-500 text-white' 
                    : stage.id === 'preparation' 
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' 
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                }`}>
                  {stage.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-xs font-medium text-center ${
                  stage.completed 
                    ? 'text-green-600' 
                    : stage.id === 'preparation' 
                      ? 'text-blue-600' 
                      : 'text-gray-400'
                }`}>
                  {stage.label}
                </span>
              </div>
              {index < projectStages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-300 mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Preparation Checklist Items */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-xs font-medium text-gray-700 mb-3">Preparation Tasks</h4>
        <div className="flex flex-wrap gap-4">
          {checklist.map(item => (
            <div key={item.id} className="flex items-center">
              <button
                onClick={() => onToggleItem(item.id)}
                className="flex-shrink-0 mr-2 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label={`Toggle ${item.label}`}
              >
                {item.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>
              <span className={`text-xs font-medium ${item.completed ? 'text-green-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
