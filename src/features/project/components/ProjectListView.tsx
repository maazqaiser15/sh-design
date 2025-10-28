import React from "react";
import {
  MapPin,
  Users,
  Truck,
  Calendar,
  Building2,
  Briefcase,
  FileIcon,
  ArrowUp01Icon,
  Folder,
  ArrowUpRight,
} from "lucide-react";
import {
  ProjectListItem,
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_DESCRIPTIONS,
} from "../types";
import { formatProjectDuration, getProgressBarColor } from "../utils";
import { PieChart } from "../../../common/components/PieChart";
import { Avatar } from "../../../common/components/Avatar";
import { Card } from "common/components/Card";

interface ProjectListViewProps {
  projects: ProjectListItem[];
  onProjectClick: (project: ProjectListItem) => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  onProjectClick,
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getProgressPercentage = (project: ProjectListItem): number => {
    // Use actual progress value from project data if available
    if (project.progress !== undefined) {
      return project.progress;
    }

    // Fallback to status-based progress for backward compatibility
    switch (project.status) {
      case "D75":
        return 5;
      case "PV90":
        return 15;
      case "UB":
        return 25;
      case "WB":
        return 40;
      case "WIP":
        return 75;
      case "QF":
        return 90;
      case "Completed":
        return 100;
      case "Archived":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="bg-[#FFFFFF66]  cursor-pointer h-full flex flex-col min-h-[320px]">
            {/* Header with Title, Status, and Progress Indicator */}
            <div className="p-4 border-b border-gray-100 flex items-start gap-4">
              {/* Project Info - Left Side */}
              <div className="flex-1">
                <div className="mb-3">
                  <div className="flex items-center w-full justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {project.title}
                    </h3>
                    {project.title
                      .toLowerCase()
                      .includes("quality assurance") && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        QC pending
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">Testing subtitle</p>
                </div>

                {/* Status Badge and VIN Code */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      PROJECT_STATUS_COLORS[project.status]
                    }`}>
                    {PROJECT_STATUS_DESCRIPTIONS[project.status]}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                    {project.vinCode}
                  </span>
                </div>
              </div>

              {/* Progress Indicator - Right Side */}
              {(project.status === "WIP" || project.status === "Completed") && (
                <div
                  className="flex-shrink-0 flex flex-col items-end justify-center"
                  style={{ width: "80px" }}>
                  {project.status === "WIP" && (
                    <PieChart
                      percentage={getProgressPercentage(project)}
                      size={60}
                    />
                  )}
                  {project.status === "Completed" && (
                    <>
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          Progress
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {getProgressPercentage(project)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getProgressBarColor(
                            project.status
                          )}`}
                          style={{
                            width: `${getProgressPercentage(project)}%`,
                          }}></div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Additional Project Info */}
            <div className="px-4 pb-4 pt-4 flex-1">
              <div className="grid grid-cols-3 gap-4">
                {/* Left Column */}
                <div className="space-y-3 col-span-2">
                  {/* Site */}
                  <div className="flex items-center text-gray-700">
                    <Building2 className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Site</div>
                      <div className="text-sm font-medium truncate">
                        {project.site}
                      </div>
                    </div>
                  </div>

                  {/* Project Duration */}
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Project Duration
                      </div>
                      <div className="text-sm font-medium">
                        <span>
                          {new Date(project.startDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span>
                          {new Date(project.endDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Industry</div>
                      <div className="text-sm font-medium">
                        {project.industry}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 col-span-1">
                  {/* Crew */}
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Crew</div>
                      <div className="flex items-center gap-1 mt-1 relative">
                        {project.crew && project.crew.length > 0 ? (
                          <>
                            {project.crew.slice(0, 2).map((member, index) => {
                              // Use different placeholder images from the internet
                              const placeholderImages = [
                                "https://i.pravatar.cc/150?img=1",
                                "https://i.pravatar.cc/150?img=2",
                                "https://i.pravatar.cc/150?img=3",
                                "https://i.pravatar.cc/150?img=4",
                                "https://i.pravatar.cc/150?img=5",
                                "https://i.pravatar.cc/150?img=6",
                              ];
                              const imageUrl =
                                member.avatar ||
                                placeholderImages[
                                  index % placeholderImages.length
                                ];
                              const leftOffset = index * 10;
                              return (
                                <Avatar
                                  key={index}
                                  name={member.name || `Member ${index + 1}`}
                                  src={imageUrl}
                                  size="sm"
                                  className={`border border-white absolute rounded-full shadow-sm `}
                                  showInitials={false}
                                  style={{ right: `${leftOffset}px` }}
                                />
                              );
                            })}
                            <span className="text-sm font-medium text-gray-700 ml-1 relative right-2">
                              +{project.crew.length}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Not assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Trailer */}
                  <div className="flex items-center text-gray-700">
                    <Truck className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Trailer</div>
                      <div className="text-sm font-medium">
                        {project.assignedTrailer || "Not assigned"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
