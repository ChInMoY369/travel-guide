import { initAnimations } from './heroAnimations';
import { initScrollReveal } from './scrollAnimations';
import { initMobileMenu } from './navigationAnimations';
import { initVirtualTour } from './tourAnimations';

// Initialize all animations
export function initAllAnimations() {
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize virtual tour functionality
    initVirtualTour();
  });
}

// Export individual functions
export {
  initAnimations,
  initScrollReveal,
  initMobileMenu,
  initVirtualTour
}; 