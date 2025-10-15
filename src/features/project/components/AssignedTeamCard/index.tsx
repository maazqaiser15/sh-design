import React from 'react';
import { Button } from '../../../../common/components/Button';
import { TeamCardsGrid } from '../TeamCard';
import { Card } from 'common/components/Card';

// Icons from Figma design
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333Z" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8L7.33333 9.33333L10.6667 6" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExpandIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1V11M1 6H11" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 6.66667C13.3333 8.50761 11.841 10 10 10C8.15905 10 6.66667 8.50761 6.66667 6.66667C6.66667 4.82572 8.15905 3.33333 10 3.33333C11.841 3.33333 13.3333 4.82572 13.3333 6.66667Z" stroke="#0D76BF" strokeWidth="1.5"/>
    <path d="M10 12.5C7.23858 12.5 5 14.7386 5 17.5H15C15 14.7386 12.7614 12.5 10 12.5Z" stroke="#0D76BF" strokeWidth="1.5"/>
    <path d="M15.8333 6.66667C15.8333 7.58714 15.4542 8.47052 14.7791 9.14559C14.104 9.82066 13.2206 10.2 12.3 10.2" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17.5 12.5C17.5 13.4205 17.1209 14.3039 16.4458 14.9789C15.7707 15.654 14.8873 16.0333 13.9667 16.0333" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => (
  <div className="flex flex-col gap-1.5 items-center w-full">
    {icon}
    <p className="font-normal text-xs text-[#475467] text-center leading-4">{message}</p>
  </div>
);

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle: any;
  actionButtons?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionButtons }) => (
  <div className="flex gap-4 items-start w-full">
    <div className="flex flex-col gap-1 flex-1">
      <h3 className="font-semibold text-lg text-[#101828] leading-7">{title}</h3>
      <p className="font-normal text-sm text-[#475467] leading-5">{subtitle}</p>
    </div>
    {actionButtons}
  </div>
);

// Main Component Props
interface AssignedTeamCardProps {
  assignedTeam?: {
    members: Array<{
      id: string;
      name: string;
      role: string;
      avatar?: string;
      location?: string;
      inviteStatus?: 'pending' | 'accepted' | 'declined' | 'expired';
      invitedAt?: string;
    }>;
    count: number;
    leadMember?: {
      id: string;
      name: string;
      role: string;
      location?: string;
    };
  } | null;
  onAddMember?: () => void;
  onRemoveMember?: (memberId: string) => void;
  onResendInvite?: (memberId: string) => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
  showActions?: boolean;
}

/**
 * AssignedTeamCard - Displays team assignment information
 * Shows assigned team members or empty state with action buttons
 */
export const AssignedTeamCard: React.FC<AssignedTeamCardProps> = ({
  assignedTeam,
  onAddMember,
  onRemoveMember,
  onResendInvite,
  onMarkComplete,
  isCompleted = false,
  showActions = true
}) => {
  const hasTeam = assignedTeam && assignedTeam.members.length > 0;

  const renderActionButtons = () => {
    if (!showActions) return null;

    return (
      <div className="flex gap-2 items-center">
        {/* Mark as Complete / Completed Button - Only show when team exists */}
        {hasTeam && (
          isCompleted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5">
              <CheckCircleIcon />
              Completed
            </div>
          ) : (
            <button
              onClick={onMarkComplete}
              className="bg-white border border-[#d0d5dd] text-[#475467] px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              <CheckCircleIcon />
              Mark as Complete
            </button>
          )
        )}

        {/* Add Team Button - Always show */}
        <button
          onClick={onAddMember}
          className="bg-white border border-[#d0d5dd] border-dashed text-[#475467] w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <PlusIcon />
        </button>
      </div>
    );
  };

  const renderTeamContent = () => {
    if (hasTeam) {
      return (
        <TeamCardsGrid
          members={assignedTeam.members.map(member => ({
            ...member,
            isLead: member.id === assignedTeam.leadMember?.id
          }))}
          onMemberClick={(member) => console.log('Member clicked:', member)}
          onMemberRemove={onRemoveMember}
          onMemberResendInvite={onResendInvite}
          maxVisible={4}
        />
      );
    }

    return (
      <EmptyState
        icon={<UsersIcon />}
        message="No team assigned yet"
      />
    );
  };

  return (
    <Card className="">
      <div className="flex flex-col gap-5">
        <SectionHeader
          title="Assigned team"
          subtitle={`${assignedTeam && assignedTeam.members.length} members`}
          actionButtons={renderActionButtons()}
        />
        {renderTeamContent()}
      </div>
    </Card>
  );
};