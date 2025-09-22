import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button';

interface CollapsibleSidePanelContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CollapsibleSidePanelContext = createContext<CollapsibleSidePanelContextType | undefined>(undefined);

export const useCollapsibleSidePanel = () => {
  const context = useContext(CollapsibleSidePanelContext);
  if (!context) {
    throw new Error('useCollapsibleSidePanel must be used within a CollapsibleSidePanelProvider');
  }
  return context;
};

interface CollapsibleSidePanelProviderProps {
  children: ReactNode;
}

export const CollapsibleSidePanelProvider: React.FC<CollapsibleSidePanelProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <CollapsibleSidePanelContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CollapsibleSidePanelContext.Provider>
  );
};

interface CollapsibleSidePanelProps {
  children: ReactNode;
  title?: string;
  onClose?: () => void;
  className?: string;
}

export const CollapsibleSidePanel: React.FC<CollapsibleSidePanelProps> = ({
  children,
  title,
  onClose,
  className = ''
}) => {
  const { isOpen, close } = useCollapsibleSidePanel();

  const handleClose = () => {
    close();
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Side Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${className}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
