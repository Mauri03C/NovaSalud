
import React from 'react';
import { useForm } from 'react-hook-form';
import { Product, useStore } from '../../utils/store';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onClose: () => void;
  onSuccess?: () => void;
  isEditing?: boolean;
}

type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData, 
  onClose, 
  onSuccess,
  isEditing = false
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ProductFormData>({
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'Medicamentos',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      reorderLevel: initialData?.reorderLevel || 10,
      supplier: initialData?.supplier || '',
      barcode: initialData?.barcode || '',
      description: initialData?.description || '',
      expiryDate: initialData?.expiryDate || '',
      requiresPrescription: initialData?.requiresPrescription || false
    }
  });

  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const showNotification = useStore(state => state.addNotification);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && initialData?.id) {
        updateProduct(initialData.id, data);
      } else {
        addProduct(data);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      showNotification('Error al guardar el producto', 'error');
    }
  };

  return (
    <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="input-field"
                placeholder="Nombre del producto"
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select 
                {...register('category', { required: 'La categoría es obligatoria' })}
                className="input-field"
              >
                <option value="Medicamentos">Medicamentos</option>
                <option value="Equipos Médicos">Equipos Médicos</option>
                <option value="Cuidado Personal">Cuidado Personal</option>
                <option value="Vitaminas y Suplementos">Vitaminas y Suplementos</option>
              </select>
              {errors.category && (
                <p className="text-destructive text-xs mt-1">{errors.category.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Precio (S/) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                step="0.10"
                {...register('price', { 
                  required: 'El precio es obligatorio',
                  min: { value: 0, message: 'El precio debe ser mayor a 0' }
                })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-destructive text-xs mt-1">{errors.price.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Actual <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                {...register('stock', { 
                  required: 'El stock es obligatorio',
                  min: { value: 0, message: 'El stock no puede ser negativo' }
                })}
                className="input-field"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-destructive text-xs mt-1">{errors.stock.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Nivel de Reposición <span className="text-red-500">*</span>
              </label>
              <input 
                type="number"
                {...register('reorderLevel', { 
                  required: 'El nivel de reposición es obligatorio',
                  min: { value: 0, message: 'El nivel no puede ser negativo' }
                })}
                className="input-field"
                placeholder="10"
              />
              {errors.reorderLevel && (
                <p className="text-destructive text-xs mt-1">{errors.reorderLevel.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Proveedor <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('supplier', { required: 'El proveedor es obligatorio' })}
                className="input-field"
                placeholder="Nombre del proveedor"
              />
              {errors.supplier && (
                <p className="text-destructive text-xs mt-1">{errors.supplier.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Código de Barras
              </label>
              <input 
                {...register('barcode')}
                className="input-field"
                placeholder="Código de barras"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de Vencimiento
              </label>
              <input 
                type="date" 
                {...register('expiryDate')}
                className="input-field"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea 
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Descripción del producto"
              />
            </div>
            
            <div className="md:col-span-2 flex items-center">
              <input 
                type="checkbox" 
                id="requiresPrescription"
                {...register('requiresPrescription')}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="requiresPrescription" className="text-sm font-medium">
                Requiere Receta Médica
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;