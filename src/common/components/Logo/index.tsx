import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

/**
 * Safe Haven Defense Logo Component
 * Features a stylized bird (eagle/phoenix) within a shield
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
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="currentColor"
        >
          {/* Shield Outline */}
          <path
            d="M50 5 L85 25 L85 65 L50 95 L15 65 L15 25 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          
          {/* Bird Body and Wings */}
          <g fill="currentColor">
            {/* Bird Head */}
            <circle cx="35" cy="35" r="4" />
            <path d="M30 35 L25 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Left Wing */}
            <path
              d="M35 40 Q20 30 15 45 Q20 55 35 50 Q30 45 35 40"
              fill="currentColor"
            />
            
            {/* Right Wing */}
            <path
              d="M35 40 Q50 30 65 45 Q50 55 35 50 Q40 45 35 40"
              fill="currentColor"
            />
            
            {/* Wing Details - Left */}
            <path
              d="M25 40 Q30 35 35 40 Q30 45 25 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            
            {/* Wing Details - Right */}
            <path
              d="M45 40 Q50 35 55 40 Q50 45 45 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            
            {/* Body and Tail */}
            <path
              d="M35 40 L35 60 Q30 65 25 60 Q30 55 35 50"
              fill="currentColor"
            />
            
            {/* Celtic Knot Pattern at Base */}
            <path
              d="M30 60 Q35 65 40 60 Q45 55 50 60 Q45 65 40 60 Q35 55 30 60"
              fill="currentColor"
            />
          </g>
        </svg>
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
