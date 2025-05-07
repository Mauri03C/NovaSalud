
// Product categories
export type ProductCategory = 'Medicamentos' | 'Equipos Médicos' | 'Cuidado Personal' | 'Vitaminas y Suplementos';

// Product interface
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  reorderLevel: number;
  supplier: string;
  expiryDate?: string; // Fecha de caducidad para medicamentos
  requiresPrescription?: boolean; // Si requiere receta médica
  description?: string; // Descripción del producto
  barcode?: string; // Código de barras
}

// Customer interface
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  lastPurchase: string;
  address?: string;
  dni?: string; // Documento Nacional de Identidad peruano
  hasMedicalInsurance?: boolean;
}

// Sale interface
export interface Sale {
  id: string;
  date: string;
  customer: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Yape' | 'Plin';
  status: 'Completed' | 'Refunded' | 'Pending';
  hasPrescription?: boolean; // Indica si la venta incluye medicamentos con receta
  employeeId?: string; // ID del empleado que realizó la venta
  notes?: string; // Notas adicionales sobre la venta
}

// Empleado interface
export interface Employee {
  id: string;
  name: string;
  role: 'Administrador' | 'Farmacéutico' | 'Vendedor' | 'Cajero';
  email: string;
  phone: string;
  hireDate: string;
}

// Dummy products data
export const products: Product[] = [
  {
    id: 'P001',
    name: 'Paracetamol 500mg',
    category: 'Medicamentos',
    price: 5.50,
    stock: 150,
    reorderLevel: 30,
    supplier: 'LabFarma',
    expiryDate: '2025-12-31',
    requiresPrescription: false,
    description: 'Analgésico y antipirético para aliviar el dolor y reducir la fiebre',
    barcode: '7750001001001'
  },
  {
    id: 'P002',
    name: 'Ibuprofeno 400mg',
    category: 'Medicamentos',
    price: 8.90,
    stock: 120,
    reorderLevel: 25,
    supplier: 'MediPharma',
    expiryDate: '2025-10-15',
    requiresPrescription: false,
    description: 'Antiinflamatorio no esteroideo para aliviar dolor e inflamación',
    barcode: '7750001001002'
  },
  {
    id: 'P003',
    name: 'Amoxicilina 500mg',
    category: 'Medicamentos',
    price: 15.80,
    stock: 45,
    reorderLevel: 20,
    supplier: 'BioFarma',
    expiryDate: '2025-08-20',
    requiresPrescription: true,
    description: 'Antibiótico de amplio espectro para infecciones bacterianas',
    barcode: '7750001001003'
  },
  {
    id: 'P004',
    name: 'Termómetro Digital',
    category: 'Equipos Médicos',
    price: 24.90,
    stock: 35,
    reorderLevel: 10,
    supplier: 'MedEquip',
    description: 'Termómetro digital para medición precisa de temperatura corporal',
    barcode: '7750001001004'
  },
  {
    id: 'P005',
    name: 'Crema Hidratante',
    category: 'Cuidado Personal',
    price: 12.50,
    stock: 80,
    reorderLevel: 15,
    supplier: 'DermaCare',
    description: 'Crema hidratante para piel sensible y reseca',
    barcode: '7750001001005'
  },
  {
    id: 'P006',
    name: 'Complejo Vitamínico',
    category: 'Vitaminas y Suplementos',
    price: 29.90,
    stock: 60,
    reorderLevel: 12,
    supplier: 'NutriVit',
    description: 'Complejo de vitaminas y minerales para suplementación diaria',
    barcode: '7750001001006'
  },
  {
    id: 'P007',
    name: 'Mascarillas KN95 (Pack 10)',
    category: 'Equipos Médicos',
    price: 18.90,
    stock: 100,
    reorderLevel: 20,
    supplier: 'MedProtect',
    description: 'Pack de 10 mascarillas KN95 de alta protección',
    barcode: '7750001001007'
  },
  {
    id: 'P008',
    name: 'Alcohol en Gel 250ml',
    category: 'Cuidado Personal',
    price: 9.90,
    stock: 150,
    reorderLevel: 30,
    supplier: 'CleanPro',
    description: 'Gel antibacterial para higiene de manos',
    barcode: '7750001001008'
  }
];

// Dummy customers data
export const customers: Customer[] = [
  {
    id: 'C001',
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    phone: '987654321',
    totalPurchases: 125.75,
    lastPurchase: '2023-04-15',
    address: 'Av. Arequipa 123, Miraflores',
    dni: '40123456',
    hasMedicalInsurance: true
  },
  {
    id: 'C002',
    name: 'María García',
    email: 'maria@ejemplo.com',
    phone: '987654322',
    totalPurchases: 87.50,
    lastPurchase: '2023-04-22',
    address: 'Jr. Lima 456, San Isidro',
    dni: '42789123',
    hasMedicalInsurance: false
  },
  {
    id: 'C003',
    name: 'Carlos Rodríguez',
    email: 'carlos@ejemplo.com',
    phone: '987654323',
    totalPurchases: 234.25,
    lastPurchase: '2023-04-10',
    address: 'Calle Los Pinos 789, La Molina',
    dni: '41567890',
    hasMedicalInsurance: true
  },
  {
    id: 'C004',
    name: 'Sofía Martínez',
    email: 'sofia@ejemplo.com',
    phone: '987654324',
    totalPurchases: 45.00,
    lastPurchase: '2023-04-25',
    address: 'Av. La Marina 234, San Miguel',
    dni: '43678901',
    hasMedicalInsurance: false
  }
];

// Employees data
export const employees: Employee[] = [
  {
    id: 'E001',
    name: 'Roberto Gómez',
    role: 'Administrador',
    email: 'roberto@novasalud.com',
    phone: '987123456',
    hireDate: '2020-01-15'
  },
  {
    id: 'E002',
    name: 'Laura Torres',
    role: 'Farmacéutico',
    email: 'laura@novasalud.com',
    phone: '987123457',
    hireDate: '2021-03-10'
  },
  {
    id: 'E003',
    name: 'Miguel Ángel Ruiz',
    role: 'Vendedor',
    email: 'miguel@novasalud.com',
    phone: '987123458',
    hireDate: '2022-05-20'
  },
  {
    id: 'E004',
    name: 'Patricia Vega',
    role: 'Cajero',
    email: 'patricia@novasalud.com',
    phone: '987123459',
    hireDate: '2022-08-15'
  }
];

// Dummy sales data
export const sales: Sale[] = [
  {
    id: 'S001',
    date: '2023-04-25',
    customer: 'C001',
    products: [
      { productId: 'P001', quantity: 2, price: 5.50 },
      { productId: 'P004', quantity: 1, price: 24.90 }
    ],
    total: 35.90,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    employeeId: 'E003',
    notes: 'Cliente habitual, requiere recordatorio para recoger medicamentos mensuales'
  },
  {
    id: 'S002',
    date: '2023-04-22',
    customer: 'C002',
    products: [
      { productId: 'P002', quantity: 1, price: 8.90 },
      { productId: 'P005', quantity: 1, price: 12.50 }
    ],
    total: 21.40,
    paymentMethod: 'Cash',
    status: 'Completed',
    employeeId: 'E004'
  },
  {
    id: 'S003',
    date: '2023-04-20',
    customer: 'C003',
    products: [
      { productId: 'P003', quantity: 1, price: 15.80 },
      { productId: 'P006', quantity: 2, price: 29.90 }
    ],
    total: 75.60,
    paymentMethod: 'Yape',
    status: 'Completed',
    hasPrescription: true,
    employeeId: 'E002',
    notes: 'Paciente con tratamiento prolongado para infección'
  },
  {
    id: 'S004',
    date: '2023-04-18',
    customer: 'C004',
    products: [
      { productId: 'P001', quantity: 1, price: 5.50 }
    ],
    total: 5.50,
    paymentMethod: 'Cash',
    status: 'Completed',
    employeeId: 'E003'
  },
  {
    id: 'S005',
    date: '2023-04-26',
    customer: 'C002',
    products: [
      { productId: 'P007', quantity: 2, price: 18.90 },
      { productId: 'P008', quantity: 1, price: 9.90 }
    ],
    total: 47.70,
    paymentMethod: 'Plin',
    status: 'Completed',
    employeeId: 'E004'
  }
];

// Dashboard metrics
export const dashboardMetrics = {
  totalSales: 186.10,
  totalOrders: 5,
  totalCustomers: 4,
  lowStockItems: 1,
  salesChange: 12.5,
  ordersChange: 8.3,
  customersChange: 15.0,
  salesChartData: [120, 190, 150, 175, 125, 185, 195]
};

// Funciones de utilidad para formateo y cálculos
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-PE', options);
};

export const getStockStatus = (stock: number, reorderLevel: number) => {
  if (stock <= reorderLevel) return { status: 'Bajo', class: 'badge-red' };
  if (stock <= reorderLevel * 2) return { status: 'Medio', class: 'badge-yellow' };
  return { status: 'Bueno', class: 'badge-green' };
};

export const getCustomerById = (customerId: string) => {
  return customers.find(c => c.id === customerId) || null;
};

export const getProductById = (productId: string) => {
  return products.find(p => p.id === productId) || null;
};

export const getEmployeeById = (employeeId: string) => {
  return employees.find(e => e.id === employeeId) || null;
};
