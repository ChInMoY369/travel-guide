// Initialize mobile menu toggle
export function initMobileMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      menuButton.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
  }
} 