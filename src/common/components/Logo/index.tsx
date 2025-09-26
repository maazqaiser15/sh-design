import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

// Logo asset path - update this to point to your exported Figma SVG
const logoPath = "/assets/logo.svg";

/**
 * Logo Component from Figma Design
 * Features the new logo design with proper aspect ratio
 */
export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true,
  textSize = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <img 
          alt="SafeHavenDefense Logo" 
          src={logoPath} 
          className="w-full h-full object-contain"
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold text-gray-900 ${textSizeClasses[textSize]}`}>
            SAFE HAVEN
          </h1>
          <p className={`text-blue-600 font-medium ${textSize === 'sm' ? 'text-xs' : textSize === 'md' ? 'text-sm' : 'text-base'}`}>
            -DEFENSE
          </p>
        </div>
      )}
    </div>
  );
};
