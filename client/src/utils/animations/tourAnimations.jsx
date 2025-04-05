// Initialize virtual tour functionality
export function initVirtualTour() {
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