import React, { useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useSidebar } from '../../../contexts/SidebarContext';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile-optimized modal component
 * Slides up from bottom on mobile devices
 * Full-screen overlay on mobile, centered on desktop
 */
export const MobileModal: React.FC<MobileModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  const { isMobile } = useSidebar();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`
        ${isMobile ? 'mobile-modal open' : 'fixed inset-0 flex items-center justify-center p-4'}
        ${className}
      `}>
        <div className={`
          ${isMobile 
            ? 'w-full h-full bg-white flex flex-col' 
            : 'bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden'
          }
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {isMobile && (
              <div className="swipe-indicator" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              {isMobile ? <ChevronDown size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* Content */}
          <div className={`
            ${isMobile ? 'flex-1 overflow-y-auto' : 'overflow-y-auto'}
            ${isMobile ? 'p-4' : 'p-6'}
          `}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
