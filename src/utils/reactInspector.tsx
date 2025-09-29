import React, { useState, useEffect } from 'react';

// Simple React Inspector - Clean and minimal
// Provides basic component inspection and debugging

interface ComponentInfo {
  name: string;
  file: string;
  line: number;
  renderCount: number;
  lastRenderTime: number;
}

class ReactInspector {
  private static instance: ReactInspector;
  private componentRegistry = new Map<string, ComponentInfo>();
  private renderCounts = new Map<string, number>();
  private isEnabled = process.env.NODE_ENV === 'development';

  static getInstance(): ReactInspector {
    if (!ReactInspector.instance) {
      ReactInspector.instance = new ReactInspector();
    }
    return ReactInspector.instance;
  }

  registerComponent(name: string, file: string, line: number) {
    if (!this.isEnabled) return;

    const renderCount = (this.renderCounts.get(name) || 0) + 1;
    this.renderCounts.set(name, renderCount);

    this.componentRegistry.set(name, {
      name,
      file,
      line,
      renderCount,
      lastRenderTime: performance.now()
    });
  }

  getComponentInfo(name: string): ComponentInfo | undefined {
    return this.componentRegistry.get(name);
  }

  getAllComponents(): ComponentInfo[] {
    return Array.from(this.componentRegistry.values());
  }

  clearRegistry() {
    this.componentRegistry.clear();
    this.renderCounts.clear();
  }
}

// Global inspector instance
export const reactInspector = ReactInspector.getInstance();

// Simple inspector attributes generator
export const getInspectorProps = (componentName: string, fileName: string) => {
  if (process.env.NODE_ENV !== 'development') return {};

  const lineNumber = new Error().stack?.split('\n')[2]?.match(/:(\d+):/)?.[1] || '0';
  
  // Register component
  reactInspector.registerComponent(componentName, fileName, parseInt(lineNumber));

  return {
    'data-react-inspector': componentName,
    'data-inspector-file': fileName,
    'data-inspector-line': lineNumber,
    style: {
      cursor: 'pointer',
      position: 'relative' as const,
      transition: 'all 0.2s ease',
    },
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      
      console.group(`🔍 React Inspector: ${componentName}`);
      console.log(`📁 File: ${fileName}`);
      console.log(`📍 Line: ${lineNumber}`);
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      console.log(`🎯 Element:`, e.currentTarget);
      console.groupEnd();
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.outline = '2px solid #3b82f6';
      e.currentTarget.style.outlineOffset = '2px';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.outline = 'none';
      e.currentTarget.style.outlineOffset = '0';
    }
  };
};

// Simple React Inspector Panel
export const ReactInspectorPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setComponents(reactInspector.getAllComponents());
      const interval = setInterval(() => {
        setComponents(reactInspector.getAllComponents());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const filteredComponents = components.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (process.env.NODE_ENV !== 'development' || !isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      height: '500px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            🔍 React Inspector
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
          Press Ctrl+Shift+I to toggle
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => reactInspector.clearRegistry()}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
          Components ({filteredComponents.length})
        </h4>
        {filteredComponents.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px', padding: '20px' }}>
            No components found. Start interacting with your app to see components here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredComponents.map((component, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: 'white',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {component.name}
                </div>
                <div style={{ color: '#6b7280' }}>
                  {component.file} • Line {component.line} • {component.renderCount} renders
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple CSS for React Inspector
export const reactInspectorCSS = `
  [data-react-inspector]:hover {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 2px !important;
    position: relative !important;
    transition: all 0.2s ease !important;
  }
  
  [data-react-inspector]:hover::after {
    content: "🔍 " attr(data-react-inspector) " (" attr(data-inspector-file) ":" attr(data-inspector-line) ")";
    position: absolute;
    top: -30px;
    left: 0;
    background: #1f2937;
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    z-index: 9999;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Initialize React Inspector
if (process.env.NODE_ENV === 'development') {
  // Add CSS to document
  const style = document.createElement('style');
  style.textContent = reactInspectorCSS;
  document.head.appendChild(style);
  
  console.log('🔍 React Inspector initialized. Press Ctrl+Shift+I to open the panel.');
}