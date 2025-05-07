
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Utility functions for formatting and displaying data
export const getStockStatus = (stock: number, reorderLevel: number) => {
  if (stock <= 0) {
    return { status: 'Sin Stock', class: 'badge-red' };
  } else if (stock < reorderLevel) {
    return { status: 'Bajo', class: 'badge-yellow' };
  } else {
    return { status: 'Disponible', class: 'badge-green' };
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatTimeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
};
