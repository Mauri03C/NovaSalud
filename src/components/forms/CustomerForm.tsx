
import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer, useStore } from '../../utils/store';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface CustomerFormProps {
  initialData?: Partial<Customer>;
  onClose: () => void;
  onSuccess?: () => void;
  isEditing?: boolean;
}

type CustomerFormData = Omit<Customer, 'id' | 'totalPurchases' | 'lastPurchase' | 'createdAt' | 'updatedAt'>;

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  initialData, 
  onClose, 
  onSuccess,
  isEditing = false
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      dni: initialData?.dni || '',
      hasMedicalInsurance: initialData?.hasMedicalInsurance || false
    }
  });

  const addCustomer = useStore(state => state.addCustomer);
  const updateCustomer = useStore(state => state.updateCustomer);
  const showNotification = useStore(state => state.addNotification);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEditing && initialData?.id) {
        updateCustomer(initialData.id, data);
      } else {
        addCustomer(data);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      showNotification('Error al guardar el cliente', 'error');
    }
  };

  return (
    <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
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
                Nombre <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="input-field"
                placeholder="Nombre completo"
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input 
                type="email"
                {...register('email', { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Formato de email inválido"
                  }
                })}
                className="input-field"
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('phone', { required: 'El teléfono es obligatorio' })}
                className="input-field"
                placeholder="987654321"
              />
              {errors.phone && (
                <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                DNI
              </label>
              <input 
                {...register('dni', { 
                  pattern: {
                    value: /^[0-9]{8}$/,
                    message: "El DNI debe tener 8 dígitos"
                  }
                })}
                className="input-field"
                placeholder="12345678"
              />
              {errors.dni && (
                <p className="text-destructive text-xs mt-1">{errors.dni.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Dirección
              </label>
              <input 
                {...register('address')}
                className="input-field"
                placeholder="Dirección completa"
              />
            </div>
            
            <div className="md:col-span-2 flex items-center">
              <input 
                type="checkbox" 
                id="hasMedicalInsurance"
                {...register('hasMedicalInsurance')}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="hasMedicalInsurance" className="text-sm font-medium">
                Tiene Seguro Médico
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
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;