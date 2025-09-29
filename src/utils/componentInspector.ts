// Simple component inspector utility
// Provides basic component inspection functionality

import { getInspectorProps } from './reactInspector';

export const addComponentInspector = (componentName: string, fileName: string) => {
  return getInspectorProps(componentName, fileName);
};

// CSS for highlighting components in dev mode
export const componentInspectorCSS = `
  [data-component]:hover {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 2px !important;
    position: relative !important;
  }
  
  [data-component]:hover::after {
    content: attr(data-component) " (" attr(data-file) ")";
    position: absolute;
    top: -25px;
    left: 0;
    background: #1f2937;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 9999;
    pointer-events: none;
  }
`;
