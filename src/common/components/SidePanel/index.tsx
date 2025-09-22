import React, { useEffect } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { SidePanelProps } from '../../../types';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * Collapsible section component for side panels
 * Provides expandable content areas with caret indicators
 */
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        {isExpanded ? (
          <ChevronDown size={16} className="text-text-muted" />
        ) : (
          <ChevronRight size={16} className="text-text-muted" />
        )}
      </button>
      {isExpanded && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Side panel component for quick interactions
 * 420px width on desktop, full-width on mobile
 * Supports collapsible sections and proper focus management
 */
export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Panel */}
        <div className="fixed inset-y-0 right-0 flex max-w-full">
          <div className="w-screen max-w-md sm:max-w-lg md:max-w-xl lg:w-[420px]">
            <div className="flex h-full flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-h3 font-medium text-text-primary">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close panel"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the CollapsibleSection for use in side panels
export { CollapsibleSection };
