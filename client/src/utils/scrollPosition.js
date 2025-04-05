/**
 * Utility functions for managing scroll position
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Save the current scroll position for the home page
export const saveHomeScrollPosition = () => {
  if (window.location.pathname === '/') {
    // Save the current scroll position
    const scrollY = window.scrollY;
    console.log(`Saving home page scroll position: ${scrollY}`);
    localStorage.setItem('homePageScrollPosition', scrollY.toString());
  }
};

// Restore the saved scroll position for the home page
export const restoreHomeScrollPosition = () => {
  const savedPosition = localStorage.getItem('homePageScrollPosition');
  
  // Check if we have a saved position and we're on the home page
  if (savedPosition && window.location.pathname === '/') {
    const scrollY = parseInt(savedPosition);
    console.log(`Restoring home page to position: ${scrollY}`);
    
    // Create a sequence of forceful scroll attempts with diverse techniques
    const performScroll = () => {
      window.scrollTo(0, scrollY);
      window.scrollTo({
        top: scrollY,
        behavior: 'instant' // Most reliable option
      });
      
      // Try DOM element scrolling as well
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = scrollY;
      }
      if (document.documentElement) {
        document.documentElement.scrollTop = scrollY;
      }
      if (document.body) {
        document.body.scrollTop = scrollY;
      }
    };
    
    // Immediate attempt
    performScroll();
    
    // Then several delayed attempts to catch any layout shifts
    setTimeout(performScroll, 0);
    setTimeout(performScroll, 50);
    setTimeout(performScroll, 100);
    setTimeout(performScroll, 300);
    setTimeout(performScroll, 500);
    
    return true;
  }
  
  return false;
};

// Custom hook for managing scroll position
export const useScrollPosition = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Save scroll position when leaving the home page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (window.location.pathname === '/') {
        saveHomeScrollPosition();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (window.location.pathname === '/') {
        saveHomeScrollPosition();
      }
    };
  }, []);
  
  // Restore scroll position when returning to home page
  useEffect(() => {
    if (location.pathname === '/') {
      console.log('Home page mounted, attempting to restore scroll position');
      
      const attemptRestore = () => {
        const savedPosition = localStorage.getItem('homePageScrollPosition');
        if (savedPosition) {
          const scrollY = parseInt(savedPosition);
          console.log(`Attempting to restore scroll to: ${scrollY}`);
          
          // Use multiple scroll methods for maximum compatibility
          window.scrollTo(0, scrollY);
          window.scrollTo({
            top: scrollY,
            behavior: 'instant'
          });
          
          // Try DOM element scrolling as well
          if (document.scrollingElement) {
            document.scrollingElement.scrollTop = scrollY;
          }
          if (document.documentElement) {
            document.documentElement.scrollTop = scrollY;
          }
          if (document.body) {
            document.body.scrollTop = scrollY;
          }
        }
      };
      
      // Multiple attempts with increasing delays
      setTimeout(attemptRestore, 0);
      setTimeout(attemptRestore, 50);
      setTimeout(attemptRestore, 100);
      setTimeout(attemptRestore, 300);
      setTimeout(attemptRestore, 600);
      setTimeout(attemptRestore, 1000);
    }
  }, [location.pathname]);
  
  // Function to navigate while preserving scroll position
  const navigateWithScrollPosition = (to) => {
    // Save current scroll position if on home page
    if (window.location.pathname === '/') {
      saveHomeScrollPosition();
    }
    
    // Navigate to the new page
    navigate(to);
  };
  
  return { navigateWithScrollPosition };
}; 