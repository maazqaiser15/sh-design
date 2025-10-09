import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showInitials?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const DefaultAvatar = ({ name, size = 'md', className = '' }: { name: string; size: AvatarProps['size']; className: string }) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);

  return (
    <div className={`bg-[#0D76BF] rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <span className="text-white font-medium">
        {initials}
      </span>
    </div>
  );
};

/**
 * Avatar component with fallback handling
 * Displays user avatar image with proper error handling and fallback to initials
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  showInitials = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const shouldShowImage = src && !imageError;

  if (!shouldShowImage && showInitials) {
    return <DefaultAvatar name={name} size={size} className={className} />;
  }

  if (!shouldShowImage) {
    return (
      <div className={`bg-gray-200 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <span className="text-gray-500 font-medium">?</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className={`bg-gray-200 rounded-full flex items-center justify-center ${sizeClasses[size]} absolute inset-0`}>
          <div className="animate-pulse bg-gray-300 rounded-full w-full h-full"></div>
        </div>
      )}
      <img
        src={src}
        alt={`${name} avatar`}
        className={`rounded-full object-cover ${sizeClasses[size]} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default Avatar;
