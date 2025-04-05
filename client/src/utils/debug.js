/**
 * Debug utilities for the application
 */

// Enable or disable debug mode
const DEBUG_MODE = false;

// Log with timestamp if debug mode is enabled
export const debugLog = (message, data = null) => {
  if (!DEBUG_MODE) return;
  
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const prefix = `[${timestamp}]`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

// Log scroll position events
export const logScrollEvent = (event, position, extra = null) => {
  if (!DEBUG_MODE) return;
  
  const data = {
    position,
    url: window.location.href,
    pathname: window.location.pathname,
    ...extra
  };
  
  debugLog(`SCROLL ${event.toUpperCase()}`, data);
};

// Add a visual debug overlay to show current scroll position
export const initScrollDebugger = () => {
  if (!DEBUG_MODE) return;
  
  // Create debug overlay element
  const debugElement = document.createElement('div');
  debugElement.id = 'scroll-debugger';
  debugElement.style.position = 'fixed';
  debugElement.style.bottom = '10px';
  debugElement.style.right = '10px';
  debugElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  debugElement.style.color = 'white';
  debugElement.style.padding = '5px 10px';
  debugElement.style.borderRadius = '4px';
  debugElement.style.fontSize = '12px';
  debugElement.style.fontFamily = 'monospace';
  debugElement.style.zIndex = '9999';
  
  document.body.appendChild(debugElement);
  
  // Update scroll position in real-time
  const updateDebugInfo = () => {
    const scrollY = window.scrollY;
    const savedPosition = localStorage.getItem('homePageScrollPosition');
    
    debugElement.innerHTML = `
      <div>Scroll Y: ${scrollY}</div>
      <div>Saved: ${savedPosition || 'none'}</div>
      <div>Path: ${window.location.pathname}</div>
    `;
  };
  
  // Update immediately and on scroll
  updateDebugInfo();
  window.addEventListener('scroll', updateDebugInfo);
}; 