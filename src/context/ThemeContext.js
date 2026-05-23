import { createContext, useContext, useState, useEffect } from 'react';
 
const ThemeContext = createContext();
 
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fleury-theme') || 'light';
  });
 
  useEffect(() => {
    localStorage.setItem('fleury-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
 
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
 
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
 
export const useTheme = () => useContext(ThemeContext);
  
