
// Type definitions for our data models
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    reorderLevel: number;
    supplier: string;
    barcode?: string;
    description?: string;
    expiryDate?: string;
    requiresPrescription: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    dni?: string;
    hasMedicalInsurance: boolean;
    totalPurchases: number;
    lastPurchase: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SaleProduct {
    productId: string;
    quantity: number;
  }
  
  export interface Sale {
    id: string;
    date: string;
    customer: string;
    products: SaleProduct[];
    total: number;
    paymentMethod: string;
    status: 'Completed' | 'Pending' | 'Refunded';
    createdAt: string;
    updatedAt: string;
  }
  
  // Notification types
  export type NotificationType = 'info' | 'success' | 'warning' | 'error';
  
  export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    createdAt: string;
    read: boolean;
  }