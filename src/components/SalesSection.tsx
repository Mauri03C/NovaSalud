
import React, { useState } from 'react';
import { Search, ShoppingCart, Filter, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Eye, Printer, X, RefreshCw } from 'lucide-react';
import { useStore, Sale } from '../utils/store';
import { Button } from '@/components/ui/button';
import Modal from './ui/modal';
import SaleForm from './forms/SaleForm';
import ConfirmDialog from './ui/confirm-dialog';
import { useApp } from '../contexts/AppContext';

interface SaleFilter {
  startDate: string;
  endDate: string;
  customerId: string;
  status: string;
  paymentMethod: string;
  searchTerm: string;
}

type SortKey = keyof Pick<Sale, 'id' | 'date' | 'total'>;

const SalesSection: React.FC = () => {
  const { showNotification } = useApp();
  
  // Estados del componente
  const [filters, setFilters] = useState<SaleFilter>({
    searchTerm: '',
    startDate: '',
    endDate: '',
    customerId: '',
    status: '',
    paymentMethod: ''
  });
  const [showNewSale, setShowNewSale] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: SortKey, direction: 'asc' | 'desc'} | null>(null);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [saleToRefund, setSaleToRefund] = useState<Sale | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  
  // Datos del store
  const sales = useStore(state => state.sales);
  const customers = useStore(state => state.customers);
  const updateSale = useStore(state => state.updateSale);
  const deleteSale = useStore(state => state.deleteSale);
  const getCustomerById = useStore(state => state.getCustomerById);
  const getProductById = useStore(state => state.getProductById);
  const formatCurrency = useStore(state => state.formatCurrency);
  const formatDate = useStore(state => state.formatDate);
  
  // Función para ordenar ventas
  const sortedSales = [...sales].sort((a, b) => {
    if (!sortConfig) return new Date(b.date).getTime() - new Date(a.date).getTime(); // Default: más reciente primero
    
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Función para solicitar ordenamiento
  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Filtrar ventas según criterios
  const filteredSales = sortedSales.filter(sale => 
    (sale.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    (getCustomerById(sale.customer)?.name || '').toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
    (filters.startDate ? new Date(sale.date) >= new Date(filters.startDate) : true) &&
    (filters.endDate ? new Date(sale.date) <= new Date(filters.endDate) : true) &&
    (filters.customerId ? sale.customer === filters.customerId : true) &&
    (filters.status ? sale.status === filters.status : true) &&
    (filters.paymentMethod ? sale.paymentMethod === filters.paymentMethod : true)
  );
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      startDate: '',
      endDate: '',
      customerId: '',
      status: '',
      paymentMethod: ''
    });
  };
  
  const handleViewSale = (sale: Sale) => {
    setViewingSale(sale);
  };
  
  const handleRefundClick = (sale: Sale) => {
    // Solo permitir reembolsos de ventas completadas
    if (sale.status !== 'Completed') {
      showNotification(`Solo se pueden reembolsar ventas completadas`, 'warning');
      return;
    }
    
    setSaleToRefund(sale);
    setShowRefundConfirm(true);
  };
  
  const handleConfirmRefund = async () => {
    if (!saleToRefund) return;
    
    setIsRefunding(true);
    try {
      const success = updateSale(saleToRefund.id, { status: 'Refunded' });
      
      if (success) {
        showNotification(`Venta ${saleToRefund.id} reembolsada correctamente`, 'success');
      }
    } catch (error) {
      console.error('Error al reembolsar venta:', error);
      showNotification('Error al procesar el reembolso', 'error');
    } finally {
      setIsRefunding(false);
      setShowRefundConfirm(false);
      setSaleToRefund(null);
    }
  };
  
  const handlePrintSale = (sale: Sale) => {
    // Simulación de impresión
    showNotification('Preparando impresión...', 'info');
    
    setTimeout(() => {
      showNotification('Documento enviado a la impresora', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <h2 className="section-title mb-0">Gestión de Ventas</h2>
          <div className="flex items-center p-2 border border-border rounded-lg bg-card shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar ventas..."
              className="ml-2 outline-none w-full md:w-64 bg-transparent"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Button 
            variant="outline"
            onClick={() => setShowFilter(!showFilter)}
            className="w-full md:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Filtros</span>
          </Button>
          
          <Button 
            onClick={() => setShowNewSale(true)}
            className="w-full md:w-auto"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Nueva Venta</span>
          </Button>
        </div>
      </div>
      
      {showFilter && (
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Filtrar Ventas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Fecha Inicial
              </label>
              <input
                type="date"
                name="startDate"
                className="input-field"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Fecha Final
              </label>
              <input
                type="date"
                name="endDate"
                className="input-field"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Cliente
              </label>
              <select
                name="customerId"
                className="input-field"
                value={filters.customerId}
                onChange={handleFilterChange}
              >
                <option value="">Todos los clientes</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Estado
              </label>
              <select
                name="status"
                className="input-field"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos los estados</option>
                <option value="Completed">Completado</option>
                <option value="Pending">Pendiente</option>
                <option value="Refunded">Reembolsado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Método de Pago
              </label>
              <select
                name="paymentMethod"
                className="input-field"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
              >
                <option value="">Todos los métodos</option>
                <option value="Cash">Efectivo</option>
                <option value="Credit Card">Tarjeta de Crédito</option>
                <option value="Debit Card">Tarjeta de Débito</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline"
              onClick={clearFilters}
              className="mr-2"
            >
              Limpiar Filtros
            </Button>
            <Button 
              onClick={() => setShowFilter(false)}
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
      
      {filteredSales.length === 0 ? (
        <div className="alert-message info flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>No se encontraron ventas con los criterios de búsqueda especificados.</p>
          {(filters.searchTerm || filters.startDate || filters.endDate || filters.customerId || filters.status || filters.paymentMethod) && (
            <Button
              variant="link"
              onClick={clearFilters}
              className="ml-2"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="dashboard-card p-0 overflow-hidden">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('id')} className="cursor-pointer hover:bg-accent">
                    <div className="flex items-center">
                      ID
                      {sortConfig?.key === 'id' && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort('date')} className="cursor-pointer hover:bg-accent">
                    <div className="flex items-center">
                      Fecha
                      {sortConfig?.key === 'date' && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </th>
                  <th>Cliente</th>
                  <th>Artículos</th>
                  <th onClick={() => requestSort('total')} className="cursor-pointer hover:bg-accent">
                    <div className="flex items-center">
                      Total
                      {sortConfig?.key === 'total' && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </th>
                  <th>Pago</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => {
                  const customer = getCustomerById(sale.customer);
                  
                  return (
                    <tr key={sale.id} className="hover:bg-accent/50">
                      <td>{sale.id}</td>
                      <td>{formatDate(sale.date)}</td>
                      <td>{customer?.name || 'Cliente Desconocido'}</td>
                      <td>
                        {sale.products.slice(0, 2).map((item, index) => {
                          const product = getProductById(item.productId);
                          return (
                            <div key={index} className="text-xs">
                              {product?.name || 'Producto Desconocido'} (x{item.quantity})
                            </div>
                          );
                        })}
                        {sale.products.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{sale.products.length - 2} más
                          </div>
                        )}
                      </td>
                      <td className="font-medium">{formatCurrency(sale.total)}</td>
                      <td>{translatePaymentMethod(sale.paymentMethod)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(sale.status)}`}>
                          {translateStatus(sale.status)}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-1">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900" 
                            title="Ver Detalles"
                            onClick={() => handleViewSale(sale)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100 dark:hover:bg-green-900" 
                            title="Imprimir"
                            onClick={() => handlePrintSale(sale)}
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          {sale.status === 'Completed' && (
                            <button 
                              className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900" 
                              title="Reembolsar"
                              onClick={() => handleRefundClick(sale)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal para nueva venta */}
      <Modal 
        isOpen={showNewSale} 
        onClose={() => setShowNewSale(false)}
      >
        <SaleForm onClose={() => setShowNewSale(false)} />
      </Modal>
      
      {/* Modal para detalles de venta */}
      <Modal
        isOpen={viewingSale !== null}
        onClose={() => setViewingSale(null)}
      >
        {viewingSale && (
          <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  Detalles de Venta: {viewingSale.id}
                </h3>
                <button 
                  onClick={() => setViewingSale(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Información General</h4>
                  <div className="bg-accent p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fecha:</span>
                      <span className="text-sm font-medium">{formatDate(viewingSale.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cliente:</span>
                      <span className="text-sm font-medium">{getCustomerById(viewingSale.customer)?.name || 'Cliente Desconocido'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Método de Pago:</span>
                      <span className="text-sm font-medium">{translatePaymentMethod(viewingSale.paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <span className={`badge ${getStatusBadgeClass(viewingSale.status)}`}>
                        {translateStatus(viewingSale.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Resumen de Compra</h4>
                  <div className="bg-accent p-4 rounded-lg">
                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                      {viewingSale.products.map((item, index) => {
                        const product = getProductById(item.productId);
                        return (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm">
                              {product?.name || 'Producto Desconocido'} (x{item.quantity})
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency((product?.price || 0) * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">{formatCurrency(viewingSale.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setViewingSale(null)}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => handlePrintSale(viewingSale)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                {viewingSale.status === 'Completed' && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setViewingSale(null); 
                      handleRefundClick(viewingSale);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reembolsar
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Modal de confirmación para reembolso */}
      <Modal 
        isOpen={showRefundConfirm} 
        onClose={() => setShowRefundConfirm(false)}
      >
        <ConfirmDialog 
          title="Reembolsar Venta"
          message={`¿Estás seguro de que deseas reembolsar la venta ${saleToRefund?.id}? Esta acción restaurará el stock de los productos y ajustará las estadísticas del cliente.`}
          confirmText="Reembolsar"
          cancelText="Cancelar"
          onConfirm={handleConfirmRefund}
          onCancel={() => setShowRefundConfirm(false)}
          isLoading={isRefunding}
        />
      </Modal>
    </div>
  );
};

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Completed': return 'badge-green';
    case 'Refunded': return 'badge-red';
    case 'Pending': return 'badge-yellow';
    default: return 'badge-blue';
  }
}

function translateStatus(status: string): string {
  switch (status) {
    case 'Completed': return 'Completado';
    case 'Refunded': return 'Reembolsado';
    case 'Pending': return 'Pendiente';
    default: return status;
  }
}

function translatePaymentMethod(method: string): string {
  switch (method) {
    case 'Credit Card': return 'Tarjeta de Crédito';
    case 'Cash': return 'Efectivo';
    case 'Debit Card': return 'Tarjeta de Débito';
    case 'Yape': return 'Yape';
    case 'Plin': return 'Plin';
    default: return method;
  }
}

export default SalesSection;