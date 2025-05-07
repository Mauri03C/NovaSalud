
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreState } from './types';
import { createProductSlice } from './productSlice';
import { createCustomerSlice } from './customerSlice';
import { createSaleSlice } from './saleSlice';
import { createNotificationSlice } from './notificationSlice';
import { initialProducts, initialCustomers, initialSales } from '../data/initialData';
import { formatCurrency, formatDate, formatTimeAgo, getStockStatus } from '../utils/formatters';

// Create the combined store with all slices
export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createProductSlice(set, get, api),
      ...createCustomerSlice(set, get, api),
      ...createSaleSlice(set, get, api),
      ...createNotificationSlice(set, get, api),
      
      // Add utility functions to the store
      getStockStatus,
      formatCurrency,
      formatDate,
      formatTimeAgo
    }),
    {
      name: 'nova-salud-storage',
      partialize: (state) => ({
        products: state.products,
        customers: state.customers,
        sales: state.sales,
        notifications: state.notifications
      }),
      // Initialize store with initial data
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Only initialize with sample data if there's no existing data
          if (!state.products || state.products.length === 0) {
            state.products = initialProducts;
          }
          if (!state.customers || state.customers.length === 0) {
            state.customers = initialCustomers;
          }
          if (!state.sales || state.sales.length === 0) {
            state.sales = initialSales;
          }
        }
      }
    }
  )
);

// Export utility functions and selectors
export {
  getStockStatus,
  formatCurrency,
  formatDate,
  formatTimeAgo
};

// Export type definitions
export * from './types';