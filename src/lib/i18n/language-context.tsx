
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { i18n, Locale, translations } from './translations';

// Define the context shape
type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

// Create the context with a default value
const defaultValue: LanguageContextType = {
  locale: i18n.defaultLocale as Locale,
  setLocale: () => {},
  t: (key) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

// Translation helper function
const getTranslation = (locale: Locale, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return the key if the translation is not found
    }
  }
  
  return String(value);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(i18n.defaultLocale as Locale);
  
  const t = (key: string): string => getTranslation(locale, key);
  
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
