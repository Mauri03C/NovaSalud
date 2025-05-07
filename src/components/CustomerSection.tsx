import React, { useState } from 'react';
import { Search, UserPlus, Edit, User, Trash2, CheckCircle, AlertTriangle, ShoppingCart, Filter, X } from 'lucide-react';
import { useStore, Customer } from '../utils/store';
import { Button } from '@/components/ui/button';
import Modal from './ui/modal';
import CustomerForm from './forms/CustomerForm';
import SaleForm from './forms/SaleForm';
import ConfirmDialog from './ui/confirm-dialog';
import { useApp } from '../contexts/AppContext';

interface CustomerFilters {
  searchTerm: string;
  hasMedicalInsurance: string;
  hasRecentPurchase: boolean;
}

const CustomerSection: React.FC = () => {
  const { showNotification } = useApp();
  
  // Estados del componente
  const [filters, setFilters] = useState<CustomerFilters>({
    searchTerm: '',
    hasMedicalInsurance: 'all',
    hasRecentPurchase: false
  });
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomerDetails, setViewingCustomerDetails] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [selectedCustomerForSale, setSelectedCustomerForSale] = useState<string>('');
  
  // Datos del store
  const customers = useStore(state => state.customers);
  const sales = useStore(state => state.sales);
  const products = useStore(state => state.products);
  const deleteCustomer = useStore(state => state.deleteCustomer);
  const formatCurrency = useStore(state => state.formatCurrency);
  const formatDate = useStore(state => state.formatDate);
  const getProductById = useStore(state => state.getProductById);
  
  // Filtrar clientes según criterios
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      customer.phone.includes(filters.searchTerm) ||
      (customer.dni && customer.dni.includes(filters.searchTerm));
    
    const matchesInsurance = 
      filters.hasMedicalInsurance === 'all' || 
      (filters.hasMedicalInsurance === 'yes' && customer.hasMedicalInsurance) ||
      (filters.hasMedicalInsurance === 'no' && !customer.hasMedicalInsurance);
    
    const matchesRecentPurchase = !filters.hasRecentPurchase || 
      (new Date().getTime() - new Date(customer.lastPurchase).getTime() < 30 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesInsurance && matchesRecentPurchase;
  });
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFilters({ ...filters, [name]: checked });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };
  
  // Obtener historial de compras de un cliente
  const getCustomerPurchaseHistory = (customerId: string) => {
    return sales
      .filter(sale => sale.customer === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const handleViewDetails = (customerId: string) => {
    setViewingCustomerDetails(customerId);
  };
  
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowNewCustomer(true);
  };
  
  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    
    setIsLoading(true);
    try {
      const success = deleteCustomer(customerToDelete.id);
      
      if (success) {
        showNotification(`Cliente "${customerToDelete.name}" eliminado correctamente`, 'success');
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      showNotification('Error al eliminar el cliente', 'error');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
    }
  };
  
  const handleNewSale = (customerId: string) => {
    setSelectedCustomerForSale(customerId);
    setShowNewSaleModal(true);
  };
  
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      hasMedicalInsurance: 'all',
      hasRecentPurchase: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <h2 className="section-title mb-0">Gestión de Pacientes</h2>
          <div className="flex items-center p-2 border border-border rounded-lg bg-card shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono o DNI..."
              className="ml-2 outline-none w-full md:w-64 bg-transparent"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Button
            variant="outline"
            className="w-full md:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            <select
              className="bg-transparent border-none focus:outline-none w-full"
              name="hasMedicalInsurance"
              value={filters.hasMedicalInsurance}
              onChange={handleFilterChange}
            >
              <option value="all">Todos los pacientes</option>
              <option value="yes">Con seguro médico</option>
              <option value="no">Sin seguro médico</option>
            </select>
          </Button>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasRecentPurchase"
              name="hasRecentPurchase"
              checked={filters.hasRecentPurchase}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="hasRecentPurchase" className="text-sm">
              Compra reciente
            </label>
          </div>
          
          <Button 
            onClick={() => {
              setEditingCustomer(null);
              setShowNewCustomer(true);
            }}
            className="w-full md:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Añadir Paciente</span>
          </Button>
        </div>
      </div>
      
      {filteredCustomers.length === 0 ? (
        <div className="alert-message info flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>No se encontraron pacientes con los criterios de búsqueda especificados.</p>
          {(filters.searchTerm || filters.hasMedicalInsurance !== 'all' || filters.hasRecentPurchase) && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="dashboard-card interactive-element">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-lg">{customer.name}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm text-muted-foreground">{customer.id}</p>
                      {customer.hasMedicalInsurance && (
                        <span className="badge badge-blue text-xs">Seguro Médico</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <button 
                    className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                    title="Editar"
                    onClick={() => handleEdit(customer)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900 ml-1"
                    title="Eliminar"
                    onClick={() => handleDeleteClick(customer)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DNI:</span>
                  <span>{customer.dni || 'No registrado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="truncate max-w-[150px]">{customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span>{customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compras Totales:</span>
                  <span>{formatCurrency(customer.totalPurchases)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última Compra:</span>
                  <span>{formatDate(customer.lastPurchase)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border flex justify-between">
                <Button 
                  variant="link"
                  className="text-sm p-0 h-auto"
                  onClick={() => handleViewDetails(customer.id)}
                >
                  Ver Historial
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleNewSale(customer.id)}
                  className="text-sm flex items-center gap-1"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Nueva Compra
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal formulario cliente */}
      <Modal
        isOpen={showNewCustomer}
        onClose={() => {
          setShowNewCustomer(false);
          setEditingCustomer(null);
        }}
      >
        <CustomerForm
          initialData={editingCustomer || undefined}
          isEditing={!!editingCustomer}
          onClose={() => {
            setShowNewCustomer(false);
            setEditingCustomer(null);
          }}
        />
      </Modal>
      
      {/* Modal de confirmación para eliminar */}
      <Modal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)}
      >
        <ConfirmDialog 
          title="Eliminar Cliente"
          message={`¿Estás seguro de que deseas eliminar a "${customerToDelete?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isLoading}
        />
      </Modal>
      
      {/* Modal nueva venta */}
      <Modal
        isOpen={showNewSaleModal}
        onClose={() => setShowNewSaleModal(false)}
      >
        <SaleForm
          initialData={{ customer: selectedCustomerForSale }}
          onClose={() => setShowNewSaleModal(false)}
        />
      </Modal>
      
      {/* Modal de detalle de cliente */}
      <Modal
        isOpen={viewingCustomerDetails !== null}
        onClose={() => setViewingCustomerDetails(null)}
      >
        {viewingCustomerDetails && (
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  Historial del Paciente: {customers.find(c => c.id === viewingCustomerDetails)?.name}
                </h3>
                <button 
                  onClick={() => setViewingCustomerDetails(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total de compras</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(customers.find(c => c.id === viewingCustomerDetails)?.totalPurchases || 0)}
                  </p>
                </div>
                <div className="bg-accent p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Última compra</p>
                  <p className="text-xl font-semibold">
                    {formatDate(customers.find(c => c.id === viewingCustomerDetails)?.lastPurchase || '')}
                  </p>
                </div>
                <div className="bg-accent p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Seguro médico</p>
                  <p className="text-xl font-semibold">
                    {customers.find(c => c.id === viewingCustomerDetails)?.hasMedicalInsurance ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold mb-3">Historial de Compras</h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-accent">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Productos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {getCustomerPurchaseHistory(viewingCustomerDetails).length > 0 ? (
                      getCustomerPurchaseHistory(viewingCustomerDetails).map(sale => (
                        <tr key={sale.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(sale.date)}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {sale.products.map((item, index) => {
                              const product = getProductById(item.productId);
                              return (
                                <div key={index} className="text-xs mb-1">
                                  {product?.name || 'Producto Desconocido'} (x{item.quantity})
                                </div>
                              );
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatCurrency(sale.total)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`badge ${getStatusBadgeClass(sale.status)}`}>
                              {translateStatus(sale.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
                          No hay historial de compras
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline"
                  className="mr-2"
                  onClick={() => setViewingCustomerDetails(null)}
                >
                  Cerrar
                </Button>
                <Button onClick={() => handleNewSale(viewingCustomerDetails)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Nueva Compra
                </Button>
              </div>
            </div>
          </div>
        )}
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

export default CustomerSection;