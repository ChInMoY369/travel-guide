import React, { createContext, useState, useEffect } from 'react';

// Create a context for theme/dark mode
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Create a provider component
export const ThemeProvider = ({ children }) => {
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
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider; 