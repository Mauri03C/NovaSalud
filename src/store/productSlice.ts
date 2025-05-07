
import { StateCreator } from 'zustand';
import { Product } from '../types';
import { StoreState } from './types';

export interface ProductSlice {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProduct: (id: string, product: Partial<Product>) => boolean;
  deleteProduct: (id: string) => boolean;
  getProductById: (id: string) => Product | undefined;
}

export const createProductSlice: StateCreator<
  StoreState,
  [],
  [],
  ProductSlice
> = (set, get) => ({
  products: [],
  
  addProduct: (product) => {
    const id = `P${String(get().products.length + 1).padStart(3, '0')}`;
    const newProduct = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      products: [...state.products, newProduct]
    }));
    
    get().addNotification(`Producto "${product.name}" añadido con éxito`, 'success');
    return id;
  },
  
  updateProduct: (id, updatedProduct) => {
    const productIndex = get().products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      get().addNotification(`No se encontró el producto con ID ${id}`, 'error');
      return false;
    }
    
    const updated = {
      ...get().products[productIndex],
      ...updatedProduct,
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      products: [
        ...state.products.slice(0, productIndex),
        updated,
        ...state.products.slice(productIndex + 1)
      ]
    }));
    
    get().addNotification(`Producto "${updated.name}" actualizado con éxito`, 'success');
    return true;
  },
  
  deleteProduct: (id) => {
    const product = get().getProductById(id);
    
    if (!product) {
      get().addNotification(`No se encontró el producto con ID ${id}`, 'error');
      return false;
    }
    
    set((state) => ({
      products: state.products.filter(p => p.id !== id)
    }));
    
    get().addNotification(`Producto "${product.name}" eliminado con éxito`, 'success');
    return true;
  },
  
  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  }
});
