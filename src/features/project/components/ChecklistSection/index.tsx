import React from 'react';
import { PreparationChecklistItem } from '../../types/preparation';

interface ChecklistSectionProps {
  checklist: PreparationChecklistItem[];
  onToggleItem: (itemId: string) => void;
}

/**
 * ChecklistSection - Shows required preparation tasks with checkboxes
 * Each item displays checkbox, label, and status (Done/Pending)
 */
export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  checklist,
  onToggleItem
}) => {
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Preparation Checklist
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {completedCount}/{totalCount} completed
          </span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
              item.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => onToggleItem(item.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                item.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {item.completed && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Label */}
            <div className="flex-1">
              <span
                className={`text-sm font-medium ${
                  item.completed ? 'text-green-800' : 'text-gray-900'
                }`}
              >
                {item.label}
              </span>
              {item.required && (
                <span className="ml-2 text-xs text-red-500 font-medium">
                  Required
                </span>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.completed ? 'Done' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {progressPercentage === 100 ? (
              <span className="text-green-600 font-medium">
                🎉 All required tasks completed!
              </span>
            ) : (
              `${totalCount - completedCount} tasks remaining`
            )}
          </span>
          <span className="text-gray-500">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
      </div>
    </div>
  );
};
