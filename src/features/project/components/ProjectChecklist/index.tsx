import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { ChecklistItem } from '../../types/projectDetails';

interface ProjectChecklistProps {
  checklist: ChecklistItem[];
  onToggleItem: (itemId: string) => void;
}

/**
 * ProjectChecklist - Simple single-line checklist for preparation tasks
 * Shows core preparation tasks in a compact horizontal layout
 */
export const ProjectChecklist: React.FC<ProjectChecklistProps> = ({
  checklist,
  onToggleItem
}) => {
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Preparation Checklist</h3>
        <span className="text-xs text-gray-500">{completedCount}/{totalCount} completed</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Checklist Items - Single Line */}
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
  );
};
