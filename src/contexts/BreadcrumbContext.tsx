import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BreadcrumbItem } from '../common/components/Breadcrumb';

interface BreadcrumbContextType {
  customBreadcrumbs: BreadcrumbItem[] | null;
  setBreadcrumbs: (items: BreadcrumbItem[] | null) => void;
  clearBreadcrumbs: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

/**
 * Breadcrumb context provider for managing custom breadcrumbs
 */
export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({ children }) => {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<BreadcrumbItem[] | null>(null);

  const setBreadcrumbs = (items: BreadcrumbItem[] | null) => {
    setCustomBreadcrumbs(items);
  };

  const clearBreadcrumbs = () => {
    setCustomBreadcrumbs(null);
  };

  return (
    <BreadcrumbContext.Provider value={{
      customBreadcrumbs,
      setBreadcrumbs,
      clearBreadcrumbs,
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

/**
 * Hook to use breadcrumb context
 */
export const useBreadcrumbContext = (): BreadcrumbContextType => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbContext must be used within a BreadcrumbProvider');
  }
  return context;
};

/**
 * Hook to set custom breadcrumbs for a page
 */
export const useSetBreadcrumbs = (items: BreadcrumbItem[] | null, deps: any[] = []) => {
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbContext();
  
  React.useEffect(() => {
    setBreadcrumbs(items);
    
    // Cleanup on unmount
    return () => clearBreadcrumbs();
  }, deps);
};
