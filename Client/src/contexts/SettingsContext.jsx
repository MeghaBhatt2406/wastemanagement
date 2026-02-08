// src/contexts/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Use simple state instead of localStorage
  const [settings, setSettings] = useState({
    darkMode: false
  });

  // Apply dark mode to document whenever it changes
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [settings.darkMode]); // Only depend on darkMode, not entire settings object

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting, 
      toggleSetting
    }}>
      {children}
    </SettingsContext.Provider>
  );
};