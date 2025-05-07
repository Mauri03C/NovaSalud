
import { StateCreator } from 'zustand';
import { Customer } from '../types';
import { StoreState } from './types';

export interface CustomerSlice {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchases' | 'lastPurchase' | 'createdAt' | 'updatedAt'>) => string;
  updateCustomer: (id: string, customer: Partial<Customer>) => boolean;
  deleteCustomer: (id: string) => boolean;
  getCustomerById: (id: string) => Customer | undefined;
}

export const createCustomerSlice: StateCreator<
  StoreState,
  [],
  [],
  CustomerSlice
> = (set, get) => ({
  customers: [],
  
  addCustomer: (customer) => {
    const id = `C${String(get().customers.length + 1).padStart(3, '0')}`;
    const newCustomer = {
      ...customer,
      id,
      totalPurchases: 0,
      lastPurchase: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      customers: [...state.customers, newCustomer]
    }));
    
    get().addNotification(`Cliente "${customer.name}" añadido con éxito`, 'success');
    return id;
  },
  
  updateCustomer: (id, updatedCustomer) => {
    const customerIndex = get().customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      get().addNotification(`No se encontró el cliente con ID ${id}`, 'error');
      return false;
    }
    
    const updated = {
      ...get().customers[customerIndex],
      ...updatedCustomer,
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      customers: [
        ...state.customers.slice(0, customerIndex),
        updated,
        ...state.customers.slice(customerIndex + 1)
      ]
    }));
    
    get().addNotification(`Cliente "${updated.name}" actualizado con éxito`, 'success');
    return true;
  },
  
  deleteCustomer: (id) => {
    const customer = get().getCustomerById(id);
    
    if (!customer) {
      get().addNotification(`No se encontró el cliente con ID ${id}`, 'error');
      return false;
    }
    
    // Verificamos si hay ventas asociadas a este cliente
    const hasSales = get().sales.some(sale => sale.customer === id);
    
    if (hasSales) {
      get().addNotification(`No se puede eliminar el cliente "${customer.name}" porque tiene ventas asociadas`, 'error');
      return false;
    }
    
    set((state) => ({
      customers: state.customers.filter(c => c.id !== id)
    }));
    
    get().addNotification(`Cliente "${customer.name}" eliminado con éxito`, 'success');
    return true;
  },
  
  getCustomerById: (id) => {
    return get().customers.find(c => c.id === id);
  }
});