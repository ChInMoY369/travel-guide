import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top when route changes
    console.log(`Scrolling to top for route: ${pathname}`);
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop; 