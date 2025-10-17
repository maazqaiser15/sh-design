import React from 'react';
import { Avatar } from '../../../../common/components/Avatar';

// Mock avatar images - using reliable placeholder services
const imgAvatar1 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
const imgAvatar2 = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face";

// X Close Icon
const XCloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3L9 9" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Mail/Invite Icon
const MailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 3L6 6L10.5 3M1.5 3C1.5 2.17 2.17 1.5 3 1.5H9C9.83 1.5 10.5 2.17 10.5 3M1.5 3V9C1.5 9.83 2.17 10.5 3 10.5H9C9.83 10.5 10.5 9.83 10.5 9V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface TeamCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    location?: string;
    isLead?: boolean;
    inviteStatus?: 'pending' | 'accepted' | 'declined' | 'expired';
    invitedAt?: string;
  };
  onClick?: () => void;
  onRemove?: (memberId: string) => void;
  onResendInvite?: (memberId: string) => void;
  className?: string;
}

/**
 * TeamCard - Individual team member card component
 * Displays team member with avatar, name, role, and location
 */
export const TeamCard: React.FC<TeamCardProps> = ({
  member,
  onClick,
  onRemove,
  onResendInvite,
  className = ''
}) => {
  const { name, role, avatar, location, isLead, inviteStatus } = member;

  // Use mock avatars for demo, fallback to default avatar
  const getAvatarSrc = () => {
    if (avatar) return avatar;
    
    // Use mock avatars based on name for demo
    if (name.toLowerCase().includes('james')) return imgAvatar1;
    if (name.toLowerCase().includes('emma')) return imgAvatar2;
    
    return undefined;
  };

  const avatarSrc = getAvatarSrc();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking remove button
    onRemove?.(member.id);
  };

  const handleResendInvite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking resend button
    onResendInvite?.(member.id);
  };

  // Check if resend invite button should be shown
  const shouldShowResendButton = inviteStatus === 'pending' || inviteStatus === 'expired';

  return (
    <div 
      className={`bg-white rounded-xl  p-4 cursor-pointer hover:shadow-md transition-all duration-200 group relative ${className}`}
      onClick={onClick}
    >
      {/* Action Buttons - Shows on Hover */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Resend Invite Button */}
        {shouldShowResendButton && onResendInvite && (
          <button
            onClick={handleResendInvite}
            className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
            title="Resend invite"
          >
            <MailIcon />
          </button>
        )}
        
        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={handleRemove}
            className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            title="Remove team member"
          >
            <XCloseIcon />
          </button>
        )}
      </div>

      <div className="flex gap-3 items-center">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            src={avatarSrc}
            name={name}
            size="md"
          />
        </div>

        {/* Name, Role, and Location */}
        <div className="flex flex-col items-start min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-[#101828] leading-5 truncate">
              {name}
            </p>
          </div>
          <p className="font-normal text-sm text-[#475467] leading-5 truncate">
            {role}
          </p>
          {location && (
            <div className="flex items-center gap-1 mt-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1C4.34 1 3 2.34 3 4C3 6.5 6 9 6 9C6 9 9 6.5 9 4C9 2.34 7.66 1 6 1ZM6 5.25C5.45 5.25 5 4.8 5 4.25C5 3.7 5.45 3.25 6 3.25C6.55 3.25 7 3.7 7 4.25C7 4.8 6.55 5.25 6 5.25Z" fill="#6B7280"/>
              </svg>
              <p className="font-normal text-xs text-[#6B7280] leading-4 truncate">
                {location}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TeamCardsGridProps {
  members: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    location?: string;
    isLead?: boolean;
    inviteStatus?: 'pending' | 'accepted' | 'declined' | 'expired';
    invitedAt?: string;
  }>;
  onMemberClick?: (member: any) => void;
  onMemberRemove?: (memberId: string) => void;
  onMemberResendInvite?: (memberId: string) => void;
  maxVisible?: number;
  className?: string;
}

/**
 * TeamCardsGrid - Grid layout for team member cards
 * Displays team members in a responsive grid with overflow handling
 */
export const TeamCardsGrid: React.FC<TeamCardsGridProps> = ({
  members,
  onMemberClick,
  onMemberRemove,
  onMemberResendInvite,
  maxVisible = 6,
  className = ''
}) => {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {visibleMembers.map((member) => (
          <TeamCard
            key={member.id}
            member={member}
            onClick={() => onMemberClick?.(member)}
            onRemove={onMemberRemove}
            onResendInvite={onMemberResendInvite}
          />
        ))}
      </div>

      {/* Show remaining count if there are more members */}
      {remainingCount > 0 && (
        <div className="text-center">
          <p className="text-xs text-[#475467]">
            +{remainingCount} more member{remainingCount > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
