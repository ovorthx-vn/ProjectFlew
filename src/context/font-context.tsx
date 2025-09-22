"use client"

import * as React from 'react';

export type AppFont = {
  name: string;
  variable: string;
};

export const availableFonts: AppFont[] = [
  { name: 'Inter', variable: 'font-inter' },
  { name: 'Roboto', variable: 'font-roboto' },
  { name: 'Montserrat', variable: 'font-montserrat' },
  { name: 'Be Vietnam Pro', variable: 'font-be-vietnam-pro' },
  { name: 'Quicksand', variable: 'font-quicksand' },
];

type FontContextType = {
  font: AppFont;
  setFont: (font: AppFont) => void;
  availableFonts: AppFont[];
};

const FontContext = React.createContext<FontContextType | undefined>(undefined);

const FONT_STORAGE_KEY = 'projectflow-font';

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = React.useState<AppFont>(() => {
    if (typeof window === 'undefined') {
      return availableFonts[0];
    }
    const savedFontName = localStorage.getItem(FONT_STORAGE_KEY);
    return availableFonts.find(f => f.name === savedFontName) || availableFonts[0];
  });

  const setFont = (newFont: AppFont) => {
    localStorage.setItem(FONT_STORAGE_KEY, newFont.name);
    setFontState(newFont);
  };
  
  return (
    <FontContext.Provider value={{ font, setFont, availableFonts }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = React.useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
