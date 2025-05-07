
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationType } from '../types';
import { StoreState } from './types';

export interface NotificationSlice {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

export const createNotificationSlice: StateCreator<
  StoreState,
  [],
  [],
  NotificationSlice
> = (set) => ({
  notifications: [],
  
  addNotification: (message, type = 'info') => {
    const notification = {
      id: uuidv4(),
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50) // Límite de 50 notificaciones
    }));
  },
  
  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },
  
  clearAllNotifications: () => {
    set({ notifications: [] });
  }
});
