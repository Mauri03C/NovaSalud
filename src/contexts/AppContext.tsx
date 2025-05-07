
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface AppContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  showNotification: (message: string, type: NotificationType) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Intentar recuperar preferencia del usuario del localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });
  
  const { toast: shadowToast } = useToast();

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const showNotification = (message: string, type: NotificationType = 'info') => {
    // Usar ambos sistemas de toast para compatibilidad
    shadowToast({
      title: message,
      variant: type === 'error' ? 'destructive' : 'default',
    });
    
    toast[type](message);
  };

  useEffect(() => {
    // Actualizar localStorage y clase del documento cuando cambia el modo
    localStorage.setItem('darkMode', darkMode.toString());
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, showNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};