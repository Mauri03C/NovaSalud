
import React, { useState, useEffect } from 'react';
import { 
  useStore, 
  formatCurrency, 
  Product,
  Customer,
  Sale
} from '../../utils/store';
import { Button } from '../ui/button';
import { X, Plus, AlertTriangle, ShoppingCart } from 'lucide-react';

interface SaleFormProps {
  initialData?: Partial<Sale>;
  onClose: () => void;
  onSuccess?: () => void;
  isEditing?: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

const SaleForm: React.FC<SaleFormProps> = ({ 
  initialData, 
  onClose, 
  onSuccess,
  isEditing = false
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>(initialData?.customer || '');
  const [paymentMethod, setPaymentMethod] = useState<string>(initialData?.paymentMethod || 'Cash');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productToAdd, setProductToAdd] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Obtener datos del store
  const products = useStore(state => state.products);
  const customers = useStore(state => state.customers);
  const addSale = useStore(state => state.addSale);
  const updateSale = useStore(state => state.updateSale);
  const getProductById = useStore(state => state.getProductById);
  const getSaleById = useStore(state => state.getSaleById);
  const showNotification = useStore(state => state.addNotification);

  // Si estamos editando, cargamos los productos de la venta
  useEffect(() => {
    if (isEditing && initialData?.id) {
      const sale = getSaleById(initialData.id);
      if (sale) {
        const cartItems = sale.products.map(item => {
          const product = getProductById(item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product?.price || 0,
            name: product?.name || 'Producto desconocido'
          };
        });
        setCart(cartItems);
      }
    }
  }, [isEditing, initialData, getProductById, getSaleById]);

  // Filtrar productos con stock disponible
  const availableProducts = products.filter(product => 
    product.stock > 0 && !cart.some(item => item.productId === product.id)
  );

  const handleAddToCart = () => {
    if (!productToAdd || quantity <= 0) {
      setError('Seleccione un producto y una cantidad válida');
      return;
    }
    
    const product = getProductById(productToAdd);
    if (!product) {
      setError('Producto no encontrado');
      return;
    }

    if (product.stock < quantity) {
      setError(`Solo hay ${product.stock} unidades disponibles de ${product.name}`);
      return;
    }
    
    setError('');
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.productId === productToAdd);
    
    if (existingItem) {
      // Actualizar cantidad si ya existe
      setCart(cart.map(item => 
        item.productId === productToAdd 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      // Agregar nuevo item
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        quantity,
        price: product.price
      }]);
    }
    
    setProductToAdd('');
    setQuantity(1);
  };
  
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError('Agregue al menos un producto al carrito');
      return;
    }
    
    if (!selectedCustomer) {
      setError('Seleccione un cliente');
      return;
    }
    
    setError('');
    setSubmitting(true);
    
    try {
      const saleData = {
        date: new Date().toISOString(),
        customer: selectedCustomer,
        products: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        total: calculateTotal(),
        paymentMethod,
        status: 'Completed' as const
      };

      if (isEditing && initialData?.id) {
        updateSale(initialData.id, saleData);
        showNotification(`Venta actualizada con éxito`, 'success');
      } else {
        addSale(saleData);
        showNotification(`Venta registrada con éxito`, 'success');
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      showNotification('Error al procesar la venta', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{isEditing ? 'Editar Venta' : 'Nueva Venta'}</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Cliente <span className="text-red-500">*</span>
              </label>
              <select 
                className="input-field"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Seleccione un cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.dni ? `- DNI: ${customer.dni}` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Método de Pago <span className="text-red-500">*</span>
              </label>
              <select 
                className="input-field"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Efectivo</option>
                <option value="Credit Card">Tarjeta de Crédito</option>
                <option value="Debit Card">Tarjeta de Débito</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
              </select>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Productos</h4>
              <div className="flex flex-wrap items-center gap-2">
                <select 
                  className="input-field min-w-[200px]"
                  value={productToAdd}
                  onChange={(e) => setProductToAdd(e.target.value)}
                >
                  <option value="">Seleccione un producto</option>
                  {availableProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({formatCurrency(product.price)}) - Stock: {product.stock}
                    </option>
                  ))}
                </select>
                
                <input
                  type="number"
                  min="1"
                  placeholder="Cant."
                  className="input-field w-20"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
                
                <Button 
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!productToAdd || quantity <= 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay productos en el carrito</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-5">Producto</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-3 text-right">Precio</div>
                    <div className="col-span-2"></div>
                  </div>
                  
                  {cart.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-border last:border-0">
                      <div className="col-span-5">
                        <p className="font-medium">{item.name}</p>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-2 py-1 bg-accent rounded-md">{item.quantity}</span>
                      </div>
                      <div className="col-span-3 text-right">
                        <p>{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} c/u</p>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button 
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-border pt-4">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold">Total: {formatCurrency(calculateTotal())}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={cart.length === 0 || !selectedCustomer || submitting}
              >
                {submitting ? 'Procesando...' : isEditing ? 'Actualizar Venta' : 'Completar Venta'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleForm;