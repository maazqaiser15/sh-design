import React from 'react';
import { Edit, Calendar, MapPin, CheckCircle, Circle, ArrowRight, Settings, Wrench, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { ProjectDetails } from '../../types/projectDetails';
import { ChecklistItem } from '../../types/projectDetails';

interface ProjectHeaderWithWorkflowProps {
  project: ProjectDetails;
  checklist: ChecklistItem[];
  onEdit: () => void;
  onEditDates?: () => void;
  onToggleItem: (itemId: string) => void;
  onStageClick?: (stageId: string) => void;
  onMarkForQF?: () => void;
  onSignClientQualityCheck?: () => void;
  selectedStage?: string;
  isPreparationStage?: boolean;
  windowProgress?: { completed: number; total: number; percentage: number };
  onMarkAllWindowsCompleted?: () => void;
  completedStages?: Set<string>;
}

/**
 * ProjectHeaderWithWorkflow - Combined header and workflow component
 * Shows project details, workflow stages, and preparation tasks in a single card
 */
export const ProjectHeaderWithWorkflow: React.FC<ProjectHeaderWithWorkflowProps> = ({
  project,
  checklist,
  onEdit,
  onEditDates,
  onToggleItem,
  onStageClick,
  onMarkForQF,
  onSignClientQualityCheck,
  selectedStage,
  isPreparationStage = false,
  windowProgress,
  onMarkAllWindowsCompleted,
  completedStages = new Set()
}) => {
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Define the project stages with icons
  const projectStages = [
    { id: 'preparation', label: 'Preparation', icon: Settings, completed: completedCount === totalCount },
    { id: 'wip', label: 'Work in Progress', icon: Wrench, completed: completedStages.has('wip') || project.status === 'QF' || project.status === 'Completed' },
    { id: 'quality', label: 'Quality Check', icon: Search, completed: project.status === 'Completed' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, completed: project.status === 'Completed' }
  ];

  // Determine which stage is active - use selectedStage if provided, otherwise default based on project status
  const getActiveStage = () => {
    if (selectedStage) {
      return selectedStage;
    }
    
    switch (project.status) {
      case 'PV90':
      case 'UB':
        return 'preparation';
      case 'WB':
      case 'WIP':
        return 'wip';
      case 'Completed':
        return 'completed';
      default:
        return 'preparation';
    }
  };

  const activeStage = getActiveStage();

  // Determine if a stage is clickable - now all stages are clickable
  const isStageClickable = (stageId: string) => {
    return !!onStageClick; // All stages are clickable if onStageClick is provided
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
      <div className="flex py-6 px-6">
        {/* Left Side - Project Information Block */}
        <div className="flex-1 min-w-0 pr-6">
          {/* Header Row */}
          <div className="flex items-center space-x-3 mb-3">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {project.name}
            </h1>
            <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full flex-shrink-0">
              {project.projectId}
            </span>
            <StatusBadge
              status={project.status}
              className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-700 border-blue-200 flex-shrink-0"
            />
          </div>
          
          {/* Meta Info (inline) */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{project.location}</span>
            </div>
            <span className="mx-2 text-gray-400">•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(project.startDate)} – {formatDate(project.endDate)}</span>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-1">
              {project.description}
            </p>
          )}

          {/* Preparation Tasks or Project Progress */}
          <div className="mb-3">
            {activeStage === 'wip' ? (
              // Project Progress for Work in Progress stage
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Project Progress</span>
                  <span 
                    className="text-xs font-medium text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                    onDoubleClick={onMarkAllWindowsCompleted}
                    title="Double-click to mark all windows as completed"
                  >
                    {windowProgress ? `${windowProgress.completed}/${windowProgress.total} windows completed` : '0/0 windows completed'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: windowProgress ? `${windowProgress.percentage}%` : '0%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            ) : activeStage === 'quality' ? (
              // Project Progress for Quality Check stage (100% complete)
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Project Progress</span>
                  <span className="text-xs font-medium text-green-600">
                    {windowProgress ? `${windowProgress.total}/${windowProgress.total} windows completed` : '0/0 windows completed'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            ) : activeStage === 'completed' ? (
              // No preparation tasks shown in completed stage
              null
            ) : (
              // Preparation Tasks for other stages
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Preparation Tasks</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {checklist.map(item => (
                    <div key={item.id} className="flex items-center">
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="flex-shrink-0 mr-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label={`Toggle ${item.label}`}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                      </button>
                      <span className={`text-xs font-medium ${item.completed ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {activeStage === 'wip' ? (
              // Work in Progress stage buttons
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCircle}
                  onClick={onMarkForQF}
                  className="text-xs px-3 py-1 h-7"
                >
                  Mark for QF
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  onClick={onEdit}
                  className="text-xs px-3 py-1 h-7"
                >
                  Edit
                </Button>
              </>
            ) : activeStage === 'quality' ? (
              // Quality Check stage buttons
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCircle}
                  onClick={onSignClientQualityCheck}
                  className="text-xs px-3 py-1 h-7"
                >
                  Sign Client Quality Check Form
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  onClick={onEdit}
                  className="text-xs px-3 py-1 h-7"
                >
                  Edit
                </Button>
              </>
            ) : activeStage === 'completed' ? (
              // No buttons shown in completed stage
              null
            ) : (
              // Preparation stage buttons
              <>
                {isPreparationStage && onEditDates && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Calendar}
                    onClick={onEditDates}
                    className="text-xs px-3 py-1 h-7"
                  >
                    Edit Dates
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  onClick={onEdit}
                  className="text-xs px-3 py-1 h-7"
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Horizontal Progress Tracker */}
        <div className="flex-shrink-0" style={{ width: '360px' }}>
          <div className="flex flex-col h-full">
            {/* Left border line */}
            <div className="absolute left-0 top-0 w-0.5 h-full bg-gray-200"></div>
            
            {/* Horizontal Progress Steps */}
            <div className="relative pl-4">
              {projectStages.map((stage, index) => {
                const IconComponent = stage.icon;
                const isActive = stage.id === activeStage;
                const isCompleted = stage.completed;
                const isClickable = isStageClickable(stage.id);
                
                return (
                  <div 
                    key={stage.id} 
                    className={`flex items-center mb-3 last:mb-0 ${
                      isClickable ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2' : ''
                    }`}
                    onClick={isClickable ? () => onStageClick?.(stage.id) : undefined}
                  >
                    {/* Step Number Circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : isClickable
                            ? 'bg-white border-blue-300 text-blue-600 hover:border-blue-400'
                            : 'bg-white border-gray-300 text-gray-500'
                    }`}>
                      <span className="text-xs font-semibold">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </span>
                    </div>
                    
                    {/* Step Content */}
                    <div className="ml-3 flex-1">
                      <div className={`text-sm font-bold ${
                        isCompleted 
                          ? 'text-green-600' 
                          : isActive 
                            ? 'text-blue-600' 
                            : isClickable
                              ? 'text-blue-600 hover:text-blue-700'
                              : 'text-gray-600'
                      }`}>
                        {stage.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {stage.id === 'preparation' && 'Complete all preparation tasks'}
                        {stage.id === 'wip' && 'Begin project execution and installation'}
                        {stage.id === 'quality' && 'Review and verify installation quality'}
                        {stage.id === 'completed' && 'Project successfully completed'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
