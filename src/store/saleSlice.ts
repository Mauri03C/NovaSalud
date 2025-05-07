
import { StateCreator } from 'zustand';
import { Sale } from '../types';
import { StoreState } from './types';

export interface SaleSlice {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateSale: (id: string, sale: Partial<Sale>) => boolean;
  deleteSale: (id: string) => boolean;
  getSaleById: (id: string) => Sale | undefined;
}

export const createSaleSlice: StateCreator<
  StoreState,
  [],
  [],
  SaleSlice
> = (set, get) => ({
  sales: [],
  
  addSale: (sale) => {
    const id = `V${String(get().sales.length + 1).padStart(3, '0')}`;
    const newSale = {
      ...sale,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Actualizar stock de productos
    for (const item of sale.products) {
      const product = get().getProductById(item.productId);
      if (product) {
        get().updateProduct(item.productId, { 
          stock: product.stock - item.quantity 
        });
      }
    }
    
    // Actualizar total de compras del cliente
    const customer = get().getCustomerById(sale.customer);
    if (customer) {
      get().updateCustomer(sale.customer, {
        totalPurchases: customer.totalPurchases + sale.total,
        lastPurchase: new Date().toISOString()
      });
    }
    
    set((state) => ({
      sales: [...state.sales, newSale]
    }));
    
    get().addNotification(`Venta con ID ${id} registrada con éxito`, 'success');
    return id;
  },
  
  updateSale: (id, updatedSale) => {
    const saleIndex = get().sales.findIndex(s => s.id === id);
    
    if (saleIndex === -1) {
      get().addNotification(`No se encontró la venta con ID ${id}`, 'error');
      return false;
    }
    
    const currentSale = get().sales[saleIndex];
    const updated = {
      ...currentSale,
      ...updatedSale,
      updatedAt: new Date().toISOString()
    };
    
    // Si cambia el estado a "Refunded", devolvemos stock
    if (currentSale.status !== 'Refunded' && updated.status === 'Refunded') {
      // Restaurar stock de productos
      for (const item of currentSale.products) {
        const product = get().getProductById(item.productId);
        if (product) {
          get().updateProduct(item.productId, { 
            stock: product.stock + item.quantity 
          });
        }
      }
      
      // Actualizar total de compras del cliente
      const customer = get().getCustomerById(currentSale.customer);
      if (customer) {
        get().updateCustomer(currentSale.customer, {
          totalPurchases: Math.max(0, customer.totalPurchases - currentSale.total)
        });
      }
    }
    
    set((state) => ({
      sales: [
        ...state.sales.slice(0, saleIndex),
        updated,
        ...state.sales.slice(saleIndex + 1)
      ]
    }));
    
    get().addNotification(`Venta con ID ${id} actualizada con éxito`, 'success');
    return true;
  },
  
  deleteSale: (id) => {
    const sale = get().getSaleById(id);
    
    if (!sale) {
      get().addNotification(`No se encontró la venta con ID ${id}`, 'error');
      return false;
    }
    
    // Si la venta no está reembolsada, restauramos stock
    if (sale.status !== 'Refunded') {
      // Restaurar stock de productos
      for (const item of sale.products) {
        const product = get().getProductById(item.productId);
        if (product) {
          get().updateProduct(item.productId, { 
            stock: product.stock + item.quantity 
          });
        }
      }
      
      // Actualizar total de compras del cliente
      const customer = get().getCustomerById(sale.customer);
      if (customer) {
        get().updateCustomer(sale.customer, {
          totalPurchases: Math.max(0, customer.totalPurchases - sale.total)
        });
      }
    }
    
    set((state) => ({
      sales: state.sales.filter(s => s.id !== id)
    }));
    
    get().addNotification(`Venta con ID ${id} eliminada con éxito`, 'success');
    return true;
  },
  
  getSaleById: (id) => {
    return get().sales.find(s => s.id === id);
  }
});
