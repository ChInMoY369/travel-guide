// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initAnimations();
  
  // Initialize mobile menu toggle
  initMobileMenu();
  
  // Initialize virtual tour functionality
  initVirtualTour();
});

// Initialize animations for hero section
function initAnimations() {
  // Add animation classes to elements
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroButton = document.querySelector('.hero-button');
  
  if (heroTitle) heroTitle.classList.add('slide-in-left');
  if (heroSubtitle) heroSubtitle.classList.add('fade-in');
  if (heroButton) heroButton.classList.add('slide-up');
  
  // Animate destination tabs on load
  const tabs = document.querySelectorAll('.destination-tab');
  tabs.forEach((tab, index) => {
    setTimeout(() => {
      tab.classList.add('fade-in');
    }, 100 * index);
  });
}

// Initialize scroll reveal animations - simplified, moved to component
function initScrollReveal() {
  // This function is kept for backward compatibility but its actual implementation
  // has been moved to the HomePage component using IntersectionObserver
  console.log('Scroll reveal now handled by component IntersectionObserver');
}

// Initialize mobile menu toggle
function initMobileMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      menuButton.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
  }
}

// Initialize virtual tour functionality
function initVirtualTour() {
  const tourOptions = document.querySelectorAll('.tour-option');
  const tourPreview = document.querySelector('.tour-preview');
  
  if (tourOptions.length && tourPreview) {
    tourOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove active class from all options
        tourOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        this.classList.add('active');
        
        // Update preview image
        const imageSrc = this.getAttribute('data-image');
        const tourName = this.getAttribute('data-name');
        
        if (imageSrc) {
          tourPreview.src = imageSrc;
          tourPreview.alt = tourName || 'Virtual Tour';
        }
      });
    });
  }
}

// Export functions for use in React components
export {
  initAnimations,
  initScrollReveal,
  initMobileMenu,
  initVirtualTour
}; 