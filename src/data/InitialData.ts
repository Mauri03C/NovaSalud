
import { Product, Customer, Sale } from '../types';

// Initial data for bootstrapping the application
export const initialProducts: Product[] = [
  {
    id: 'P001',
    name: 'Paracetamol 500mg',
    category: 'Medicamentos',
    price: 5.50,
    stock: 150,
    reorderLevel: 30,
    supplier: 'Farmacéutica Nacional',
    barcode: '7501234567890',
    requiresPrescription: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'P002',
    name: 'Ibuprofeno 400mg',
    category: 'Medicamentos',
    price: 8.90,
    stock: 85,
    reorderLevel: 25,
    supplier: 'Laboratorios Lima',
    barcode: '7502345678901',
    requiresPrescription: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'P003',
    name: 'Amoxicilina 500mg',
    category: 'Medicamentos',
    price: 14.50,
    stock: 20,
    reorderLevel: 25,
    supplier: 'Farma Internacional',
    expiryDate: '2023-12-30',
    requiresPrescription: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'P004',
    name: 'Alcohol 96% 250ml',
    category: 'Cuidado Personal',
    price: 7.90,
    stock: 60,
    reorderLevel: 15,
    supplier: 'Químicos Perú',
    requiresPrescription: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'P005',
    name: 'Vitamina C 1000mg',
    category: 'Vitaminas y Suplementos',
    price: 25.90,
    stock: 40,
    reorderLevel: 10,
    supplier: 'Nutrilab',
    expiryDate: '2024-06-15',
    requiresPrescription: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'P006',
    name: 'Termómetro Digital',
    category: 'Equipos Médicos',
    price: 29.90,
    stock: 15,
    reorderLevel: 5,
    supplier: 'MediEquip',
    requiresPrescription: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'P007',
    name: 'Omeprazol 20mg',
    category: 'Medicamentos',
    price: 12.50,
    stock: 5,
    reorderLevel: 20,
    supplier: 'Laboratorios Lima',
    expiryDate: '2023-10-30',
    requiresPrescription: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'P008',
    name: 'Mascarilla KN95 (Unidad)',
    category: 'Cuidado Personal',
    price: 3.50,
    stock: 200,
    reorderLevel: 50,
    supplier: 'Safety Perú',
    requiresPrescription: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'Juan Pérez García',
    email: 'juan.perez@gmail.com',
    phone: '987654321',
    address: 'Av. Arequipa 123, Lince',
    dni: '45678912',
    hasMedicalInsurance: true,
    totalPurchases: 345.80,
    lastPurchase: '2023-05-30T10:15:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'C002',
    name: 'María Rodríguez',
    email: 'mariarodri@hotmail.com',
    phone: '987123456',
    address: 'Jr. Los Pinos 456, San Isidro',
    dni: '12345678',
    hasMedicalInsurance: false,
    totalPurchases: 120.50,
    lastPurchase: '2023-06-02T15:30:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'C003',
    name: 'Carlos Sánchez',
    email: 'carlos.sanchez@gmail.com',
    phone: '999888777',
    address: 'Calle Los Álamos 789, Miraflores',
    dni: '87654321',
    hasMedicalInsurance: true,
    totalPurchases: 540.20,
    lastPurchase: '2023-06-05T09:45:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'C004',
    name: 'Ana Gómez',
    email: 'ana.gomez@yahoo.com',
    phone: '977666555',
    hasMedicalInsurance: false,
    totalPurchases: 75.00,
    lastPurchase: '2023-05-25T14:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialSales: Sale[] = [
  {
    id: 'V001',
    date: '2023-06-05T10:15:00Z',
    customer: 'C001',
    products: [
      { productId: 'P001', quantity: 2 },
      { productId: 'P004', quantity: 1 }
    ],
    total: 18.90,
    paymentMethod: 'Cash',
    status: 'Completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'V002',
    date: '2023-06-04T15:30:00Z',
    customer: 'C002',
    products: [
      { productId: 'P002', quantity: 1 },
      { productId: 'P005', quantity: 1 }
    ],
    total: 34.80,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'V003',
    date: '2023-06-03T09:45:00Z',
    customer: 'C003',
    products: [
      { productId: 'P003', quantity: 1 },
      { productId: 'P006', quantity: 1 }
    ],
    total: 44.40,
    paymentMethod: 'Yape',
    status: 'Completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'V004',
    date: '2023-06-02T14:00:00Z',
    customer: 'C004',
    products: [
      { productId: 'P001', quantity: 1 },
      { productId: 'P008', quantity: 5 }
    ],
    total: 23.00,
    paymentMethod: 'Cash',
    status: 'Refunded',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'V005',
    date: '2023-06-01T11:30:00Z',
    customer: 'C001',
    products: [
      { productId: 'P007', quantity: 1 }
    ],
    total: 12.50,
    paymentMethod: 'Plin',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
