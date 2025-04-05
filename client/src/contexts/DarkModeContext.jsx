import React, { createContext, useState, useEffect } from 'react';

// Create a context for dark mode
export const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Create a provider component
export const DarkModeProvider = ({ children }) => {
  // Check if dark mode was previously enabled
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  // Update local storage and dispatch event when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent('themeChange', { 
      detail: { darkMode } 
    });
    document.dispatchEvent(event);
    
    // Apply or remove dark mode class on body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Provide the dark mode state and toggle function to children
  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider; 