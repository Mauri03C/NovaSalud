
import React, { useState } from 'react';
import { Search, Edit, Package, Pill, Plus, ArrowUp, ArrowDown, AlertCircle, RefreshCw, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore, Product } from '../utils/store';
import Modal from './ui/modal';
import ProductForm from './forms/ProductForm';
import ConfirmDialog from './ui/confirm-dialog';
import { useApp } from '../contexts/AppContext';

type SortKey = keyof Pick<Product, 'id' | 'name' | 'category' | 'price' | 'stock'>;

const InventorySection: React.FC = () => {
  const { showNotification } = useApp();
  
  // Estados del componente
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sortConfig, setSortConfig] = useState<{key: SortKey, direction: 'asc' | 'desc'} | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'yes' | 'no'>('all');
  
  // Datos del store
  const products = useStore(state => state.products);
  const deleteProduct = useStore(state => state.deleteProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const formatCurrency = useStore(state => state.formatCurrency);
  const getStockStatus = useStore(state => state.getStockStatus);
  
  const categories = ['Todos', 'Medicamentos', 'Equipos Médicos', 'Cuidado Personal', 'Vitaminas y Suplementos'];
  
  // Función para ordenar productos
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;
    
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
  
  // Función para filtrar productos
  const filteredProducts = sortedProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchTerm));
    
    const matchesCategory = selectedCategory === 'Todos' || 
                           product.category === selectedCategory;
    
    const matchesStockFilter = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && product.stock <= product.reorderLevel && product.stock > 0) ||
      (stockFilter === 'out' && product.stock <= 0);
    
    const matchesPrescriptionFilter = 
      prescriptionFilter === 'all' ||
      (prescriptionFilter === 'yes' && product.requiresPrescription) ||
      (prescriptionFilter === 'no' && !product.requiresPrescription);
    
    return matchesSearch && matchesCategory && matchesStockFilter && matchesPrescriptionFilter;
  });
  
  // Función para abrir modal de edición
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };
  
  // Función para abrir confirmación de eliminación
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };
  
  // Función para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsLoading(true);
    try {
      const success = deleteProduct(productToDelete.id);
      if (success) {
        showNotification(`Producto "${productToDelete.name}" eliminado correctamente`, 'success');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      showNotification('Error al eliminar el producto', 'error');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };
  
  // Función para reabastecer producto
  const handleRestock = (product: Product) => {
    const newStock = window.prompt(
      `Ingrese la cantidad a añadir al stock actual (${product.stock})`,
      "10"
    );
    
    if (newStock === null) return;
    
    const stockToAdd = parseInt(newStock);
    if (isNaN(stockToAdd) || stockToAdd <= 0) {
      showNotification('La cantidad debe ser un número mayor a cero', 'error');
      return;
    }
    
    try {
      updateProduct(product.id, { stock: product.stock + stockToAdd });
      showNotification(`Stock de "${product.name}" actualizado a ${product.stock + stockToAdd} unidades`, 'success');
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      showNotification('Error al actualizar el stock', 'error');
    }
  };
  
  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setStockFilter('all');
    setPrescriptionFilter('all');
    setSortConfig(null);
    setShowFilterMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <h2 className="section-title mb-0">Gestión de Medicamentos e Insumos</h2>
          <div className="flex items-center p-2 border border-border rounded-lg bg-card shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID, código..."
              className="ml-2 outline-none w-full md:w-64 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <Button
            variant="outline"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="w-full md:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <select
            className="input-field w-full md:w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <Button
            onClick={() => {
              setEditingProduct(null); 
              setShowAddModal(true);
            }}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Añadir Producto</span>
          </Button>
        </div>
      </div>
      
      {showFilterMenu && (
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Filtros Avanzados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nivel de Stock</label>
              <select
                className="input-field"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'out')}
              >
                <option value="all">Todos los niveles</option>
                <option value="low">Stock bajo</option>
                <option value="out">Sin stock</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Requiere Receta</label>
              <select
                className="input-field"
                value={prescriptionFilter}
                onChange={(e) => setPrescriptionFilter(e.target.value as 'all' | 'yes' | 'no')}
              >
                <option value="all">Todos</option>
                <option value="yes">Requiere receta</option>
                <option value="no">No requiere receta</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="mr-2"
            >
              Limpiar Filtros
            </Button>
            <Button onClick={() => setShowFilterMenu(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="alert-message info flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          <p>No se encontraron productos con los criterios de búsqueda especificados.</p>
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
                  <th onClick={() => requestSort('name')} className="cursor-pointer hover:bg-accent">
                    <div className="flex items-center">
                      Nombre
                      {sortConfig?.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort('category')} className="cursor-pointer hover:bg-accent">
                    <div className="flex items-center">
                      Categoría
                      {sortConfig?.key === 'category' && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort('price')} className="cursor-pointer hover:bg-accent">
                    <div className="flex items-center">
                      Precio
                      {sortConfig?.key === 'price' && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort('stock')} className="cursor-pointer hover:bg-accent">
                    <div className="flex items-center">
                      Stock
                      {sortConfig?.key === 'stock' && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </th>
                  <th>Estado</th>
                  <th>Proveedor</th>
                  <th>Vence</th>
                  <th>Receta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.reorderLevel);
                  
                  return (
                    <tr key={product.id} className="hover:bg-accent/50">
                      <td>{product.id}</td>
                      <td className="font-medium">{product.name}</td>
                      <td>{product.category}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`badge ${stockStatus.class}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td>{product.supplier}</td>
                      <td>{product.expiryDate || "N/A"}</td>
                      <td>{product.requiresPrescription ? "Sí" : "No"}</td>
                      <td className="flex space-x-2">
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900" 
                          title="Editar"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100 dark:hover:bg-green-900" 
                          title="Reabastecer"
                          onClick={() => handleRestock(product)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900" 
                          title="Eliminar"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal para añadir/editar producto */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
      >
        <ProductForm
          initialData={editingProduct || undefined}
          isEditing={!!editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      </Modal>
      
      {/* Modal de confirmación para eliminar */}
      <Modal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)}
      >
        <ConfirmDialog 
          title="Eliminar Producto"
          message={`¿Estás seguro de que deseas eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default InventorySection;