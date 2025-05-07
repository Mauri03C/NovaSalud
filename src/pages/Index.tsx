
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardMetrics from '../components/DashboardMetrics';
import InventorySection from '../components/InventorySection';
import SalesSection from '../components/SalesSection';
import CustomerSection from '../components/CustomerSection';
import { useApp } from '../contexts/AppContext';
import { Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { useStore } from '../utils/store';
import NotificationPanel from '../components/NotificationPanel';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { darkMode, toggleDarkMode } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = useStore(state => state.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar fijo en la parte superior */}
      <div className="navbar-container">
        {isMobile ? (
          <header className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={toggleMobileMenu} 
                className="p-2 rounded-md hover:bg-accent mr-2"
              >
                <Menu className="h-6 w-6 text-foreground" />
              </button>
              <h1 className="text-xl font-bold">Nova Salud</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md hover:bg-accent relative"
              >
                <Bell className="h-5 w-5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-accent"
              >
                {darkMode ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
              </button>
            </div>
          </header>
        ) : (
          <Navbar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
        )}
      </div>

      {/* Contenedor principal con flexbox */}
      <div className="flex flex-1">
        {/* Sidebar para dispositivos móviles */}
        {isMobile && (
          <>
            <div 
              className={`sidebar-mobile ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className="p-4 flex justify-between items-center border-b">
                <h1 className="text-xl font-bold">Menú</h1>
                <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <Navbar 
                activeSection={activeSection} 
                setActiveSection={(section) => {
                  setActiveSection(section);
                  setIsMobileMenuOpen(false);
                }} 
              />
            </div>
            {/* Overlay cuando el menú móvil está abierto */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
            )}
          </>
        )}

        {/* Contenido principal - se coloca debajo del navbar */}
        <div className="main-content w-full">
          {/* Botones de notificación y tema para escritorio */}
          {!isMobile && (
            <div className="fixed top-4 right-4 flex items-center space-x-2 z-20">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-card rounded-full shadow-md hover:bg-accent transition-colors relative"
              >
                <Bell className="h-5 w-5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 bg-card rounded-full shadow-md hover:bg-accent transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
              </button>
            </div>
          )}
          
          {/* Panel de notificaciones */}
          {showNotifications && (
            <div className="fixed right-4 top-16 z-50">
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            </div>
          )}
          
          {/* Contenido de la página */}
          <div className="container mx-auto px-4 py-6 flex-1">
            {activeSection === 'dashboard' && (
              <div className="space-y-6 page-container">
                <h1 className="text-3xl font-bold text-foreground">Panel Principal</h1>
                <p className="text-muted-foreground">Bienvenido al sistema de gestión de Botica "Nova Salud". Aquí tiene una visión general de su negocio.</p>
                <DashboardMetrics />
              </div>
            )}
            
            {activeSection === 'inventory' && (
              <div className="space-y-6 page-container">
                <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
                <p className="text-muted-foreground">Gestione sus medicamentos y productos farmacéuticos, controle los niveles de stock y reciba alertas de reposición.</p>
                <InventorySection />
              </div>
            )}
            
            {activeSection === 'sales' && (
              <div className="space-y-6 page-container">
                <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
                <p className="text-muted-foreground">Procese ventas de medicamentos, vea el historial de transacciones y controle los ingresos.</p>
                <SalesSection />
              </div>
            )}
            
            {activeSection === 'customers' && (
              <div className="space-y-6 page-container">
                <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
                <p className="text-muted-foreground">Gestione las relaciones con sus pacientes y vea el historial de compras.</p>
                <CustomerSection />
              </div>
            )}
          </div>
          
          {/* Footer */}
          <footer className="bg-card border-t border-border py-4">
            <div className="container mx-auto px-4">
              <p className="text-center text-muted-foreground">
                &copy; 2023 Botica Nova Salud. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;