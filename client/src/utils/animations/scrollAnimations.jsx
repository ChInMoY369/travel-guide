// Initialize scroll reveal animations
export function initScrollReveal() {
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }
  
  // Function to handle scroll animations
  function handleScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('active');
      }
    });
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Check on initial load
  handleScroll();
} 