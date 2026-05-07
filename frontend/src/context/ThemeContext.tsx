import { createContext, useContext } from 'react';

interface ThemeContextValue {
  theme: 'dark';
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark' });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeContext.Provider value={{ theme: 'dark' }}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
