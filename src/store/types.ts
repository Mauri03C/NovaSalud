
import { ProductSlice } from './productSlice';
import { CustomerSlice } from './customerSlice';
import { SaleSlice } from './saleSlice';
import { NotificationSlice } from './notificationSlice';
import { formatCurrency, formatDate, formatTimeAgo, getStockStatus } from '../utils/formatters';

// Re-export types from the types folder
export type { Product, Customer, Sale, SaleProduct, Notification, NotificationType } from '../types';

export interface UtilityFunctions {
  getStockStatus: typeof getStockStatus;
  formatCurrency: typeof formatCurrency;
  formatDate: typeof formatDate;
  formatTimeAgo: typeof formatTimeAgo;
}

export type StoreState = 
  ProductSlice & 
  CustomerSlice & 
  SaleSlice & 
  NotificationSlice &
  UtilityFunctions;
