import React from 'react';

// Mock avatar images from Figma
const imgAvatar1 = "http://localhost:3845/assets/5180c7274a468ba221dccc98237c5b89acc690bd.png";
const imgAvatar2 = "http://localhost:3845/assets/d20f43a765e6ed6ac3bdea39b6be2ea6b6b1193c.png";

// Default avatar fallback
const DefaultAvatar = ({ name }: { name: string }) => (
  <div className="bg-[#0D76BF] rounded-full w-8 h-8 flex items-center justify-center">
    <span className="text-white text-sm font-medium">
      {name.split(' ').map(n => n[0]).join('')}
    </span>
  </div>
);

// X Close Icon
const XCloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3L9 9" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface TeamCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    isLead?: boolean;
  };
  onClick?: () => void;
  onRemove?: (memberId: string) => void;
  className?: string;
}

/**
 * TeamCard - Individual team member card component
 * Displays team member with avatar, name, and role
 */
export const TeamCard: React.FC<TeamCardProps> = ({
  member,
  onClick,
  onRemove,
  className = ''
}) => {
  const { name, role, avatar, isLead } = member;

  // Use mock avatars for demo, fallback to default avatar
  const getAvatarSrc = () => {
    if (avatar) return avatar;
    
    // Use mock avatars based on name for demo
    if (name.toLowerCase().includes('james')) return imgAvatar1;
    if (name.toLowerCase().includes('emma')) return imgAvatar2;
    
    return null;
  };

  const avatarSrc = getAvatarSrc();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking remove button
    onRemove?.(member.id);
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 group relative ${className}`}
      onClick={onClick}
    >
      {/* Remove Button - Shows on Hover */}
      {onRemove && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          title="Remove team member"
        >
          <XCloseIcon />
        </button>
      )}

      <div className="flex gap-3 items-center">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatarSrc ? (
            <div 
              className="w-8 h-8 rounded-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${avatarSrc}')` }}
            />
          ) : (
            <DefaultAvatar name={name} />
          )}
        </div>

        {/* Name and Role */}
        <div className="flex flex-col items-start min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-[#101828] leading-5 truncate">
              {name}
            </p>
            {isLead && (
              <span className="bg-[#0D76BF] text-white px-2 py-0.5 rounded text-xs font-medium">
                Lead
              </span>
            )}
          </div>
          <p className="font-normal text-sm text-[#475467] leading-5 truncate">
            {role}
          </p>
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
    isLead?: boolean;
  }>;
  onMemberClick?: (member: any) => void;
  onMemberRemove?: (memberId: string) => void;
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
  maxVisible = 6,
  className = ''
}) => {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleMembers.map((member) => (
          <TeamCard
            key={member.id}
            member={member}
            onClick={() => onMemberClick?.(member)}
            onRemove={onMemberRemove}
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
