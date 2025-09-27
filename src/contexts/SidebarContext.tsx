import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  isMobile: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  capabilities: {
    hasTouch: boolean;
    hasGeolocation: boolean;
    isRetina: boolean;
    supportsHover: boolean;
  };
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [capabilities, setCapabilities] = useState({
    hasTouch: false,
    hasGeolocation: false,
    isRetina: false,
    supportsHover: false
  });

  // Advanced device detection and capability checking
  useEffect(() => {
    const detectDeviceAndCapabilities = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Device type detection
      if (width < 768) {
        setDeviceType('mobile');
        setIsMobile(true);
      } else if (width < 1024) {
        setDeviceType('tablet');
        setIsMobile(false);
      } else {
        setDeviceType('desktop');
        setIsMobile(false);
      }

      // Capability detection
      setCapabilities({
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasGeolocation: 'geolocation' in navigator,
        isRetina: window.devicePixelRatio > 1,
        supportsHover: window.matchMedia('(hover: hover)').matches
      });

      // Close mobile sidebar when switching to desktop
      if (width >= 768) {
        setIsMobileOpen(false);
      }
    };

    detectDeviceAndCapabilities();
    window.addEventListener('resize', detectDeviceAndCapabilities);
    return () => window.removeEventListener('resize', detectDeviceAndCapabilities);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      isMobileOpen, 
      toggleSidebar, 
      toggleMobileSidebar, 
      closeMobileSidebar,
      isMobile,
      deviceType,
      capabilities
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
