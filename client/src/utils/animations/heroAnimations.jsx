// Initialize animations for hero section
export function initAnimations() {
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