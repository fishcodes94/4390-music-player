import React, { createContext, useState, useContext } from 'react';

// Create the LanguageContext
const LanguageContext = createContext();

// Custom hook to use the LanguageContext
export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Create a provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language is English

  // Function to toggle between Arabic and English
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};



