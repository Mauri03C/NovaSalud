
import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Pill,
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 p-3 rounded-lg transition-colors w-full
        ${active ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Aquí se implementaría la funcionalidad real de dark mode
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando:', searchTerm);
    // Aquí se implementaría la búsqueda real
    setShowSearch(false);
    setSearchTerm('');
  };
  
  const notifications = [
    { id: 1, title: 'Stock bajo', message: 'Paracetamol tiene pocas unidades', time: '10 min', read: false },
    { id: 2, title: 'Nueva venta', message: 'Venta #S006 completada', time: '1 hora', read: true },
    { id: 3, title: 'Recordatorio', message: 'Revisar medicamentos próximos a vencer', time: '3 horas', read: true }
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5 text-gray-500" /> : <Menu className="h-5 w-5 text-gray-500" />}
            </button>
            
            <Pill className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-900">Nova Salud</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <NavItem 
              icon={Store} 
              label="Panel" 
              active={activeSection === 'dashboard'} 
              onClick={() => setActiveSection('dashboard')}
            />
            <NavItem 
              icon={Package} 
              label="Inventario" 
              active={activeSection === 'inventory'} 
              onClick={() => setActiveSection('inventory')}
            />
            <NavItem 
              icon={ShoppingCart} 
              label="Ventas" 
              active={activeSection === 'sales'} 
              onClick={() => setActiveSection('sales')}
            />
            <NavItem 
              icon={Users} 
              label="Clientes" 
              active={activeSection === 'customers'} 
              onClick={() => setActiveSection('customers')}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5 text-gray-500" />
            </button>
            
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-500" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Notificaciones</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center border-t">
                    <button className="text-sm text-primary hover:underline">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            <div className="flex items-center ml-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                NS
              </div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium">Administrador</p>
                <div className="flex items-center text-xs text-gray-500">
                  <LogOut className="h-3 w-3 mr-1" />
                  <span>Cerrar sesión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Búsqueda expandida */}
      {showSearch && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl mx-4">
            <form onSubmit={handleSearch}>
              <div className="flex items-center">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar productos, clientes, ventas..."
                  className="flex-1 outline-none text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowSearch(false)}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </form>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Búsquedas recientes:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <button className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200">
                  Paracetamol
                </button>
                <button className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200">
                  Juan Pérez
                </button>
                <button className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200">
                  Ventas del día
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Menú móvil */}
      <div className={`md:hidden bg-white border-t absolute z-40 w-full transform transition-transform duration-300 ${showMobileMenu ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="p-2">
          <NavItem 
            icon={Store} 
            label="Panel" 
            active={activeSection === 'dashboard'} 
            onClick={() => {
              setActiveSection('dashboard');
              setShowMobileMenu(false);
            }}
          />
          <NavItem 
            icon={Package} 
            label="Inventario" 
            active={activeSection === 'inventory'} 
            onClick={() => {
              setActiveSection('inventory');
              setShowMobileMenu(false);
            }}
          />
          <NavItem 
            icon={ShoppingCart} 
            label="Ventas" 
            active={activeSection === 'sales'} 
            onClick={() => {
              setActiveSection('sales');
              setShowMobileMenu(false);
            }}
          />
          <NavItem 
            icon={Users} 
            label="Clientes" 
            active={activeSection === 'customers'} 
            onClick={() => {
              setActiveSection('customers');
              setShowMobileMenu(false);
            }}
          />
          <div className="border-t my-2 pt-2">
            <NavItem 
              icon={Settings} 
              label="Configuración" 
              active={false} 
              onClick={() => {}}
            />
            <NavItem 
              icon={LogOut} 
              label="Cerrar Sesión" 
              active={false} 
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      
      <div className="md:hidden bg-white border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          <NavItem 
            icon={Store} 
            label="Panel" 
            active={activeSection === 'dashboard'} 
            onClick={() => setActiveSection('dashboard')}
          />
          <NavItem 
            icon={Package} 
            label="Inventario" 
            active={activeSection === 'inventory'} 
            onClick={() => setActiveSection('inventory')}
          />
          <NavItem 
            icon={ShoppingCart} 
            label="Ventas" 
            active={activeSection === 'sales'} 
            onClick={() => setActiveSection('sales')}
          />
          <NavItem 
            icon={Users} 
            label="Clientes" 
            active={activeSection === 'customers'} 
            onClick={() => setActiveSection('customers')}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;