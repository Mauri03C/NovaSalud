
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ShoppingCart, Users, Package, AlertTriangle, Pill } from 'lucide-react';
import { dashboardMetrics, formatCurrency, formatDate, products, sales } from '../utils/dummyData';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  changeLabel: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, changeLabel }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="stat-card interactive-element">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
      <div className={`stat-change ${isPositive ? 'stat-change-positive' : 'stat-change-negative'}`}>
        {isPositive ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        <span>{Math.abs(change)}% {changeLabel}</span>
      </div>
    </div>
  );
};

const DashboardMetrics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('month');

  // Calcular productos con bajo stock
  const lowStockProducts = products.filter(p => p.stock <= p.reorderLevel);

  // Calcular ventas recientes (últimos 3 días)
  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setSelectedPeriod('day')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${selectedPeriod === 'day' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Hoy
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 text-sm font-medium ${selectedPeriod === 'week' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${selectedPeriod === 'month' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Este Mes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas Totales"
          value={formatCurrency(dashboardMetrics.totalSales)}
          icon={<ShoppingCart className="h-6 w-6 text-primary" />}
          change={dashboardMetrics.salesChange}
          changeLabel="desde el mes pasado"
        />
        
        <StatCard
          title="Recetas Atendidas"
          value={dashboardMetrics.totalOrders}
          icon={<Pill className="h-6 w-6 text-primary" />}
          change={dashboardMetrics.ordersChange}
          changeLabel="desde el mes pasado"
        />
        
        <StatCard
          title="Pacientes Totales"
          value={dashboardMetrics.totalCustomers}
          icon={<Users className="h-6 w-6 text-primary" />}
          change={dashboardMetrics.customersChange}
          changeLabel="desde el mes pasado"
        />

        <StatCard
          title="Productos Bajo Stock"
          value={lowStockProducts.length}
          icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
          change={-5.2}
          changeLabel="desde el mes pasado"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-card lg:col-span-2">
          <h3 className="section-title">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentSales.map((sale, index) => (
              <div key={sale.id} className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between hover:bg-accent transition-colors">
                <div>
                  <p className="font-medium text-gray-800">
                    {sale.hasPrescription 
                      ? "Venta con receta médica" 
                      : "Nueva venta registrada"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {sale.products.map(p => {
                      const product = products.find(prod => prod.id === p.productId);
                      return product ? `${p.quantity}x ${product.name}` : '';
                    }).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(sale.total)}</p>
                  <p className="text-sm text-gray-500">{formatDate(sale.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="section-title">Alertas de Inventario</h3>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map(product => (
                <div key={product.id} className="p-4 border border-red-100 rounded-lg bg-red-50 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800">{product.name}</p>
                    <p className="text-sm text-red-600">Stock: {product.stock} unidades</p>
                  </div>
                  <button className="action-button text-xs">
                    Reabastecer
                  </button>
                </div>
              ))
            ) : (
              <div className="alert-message success">
                <p>¡No hay productos con stock bajo actualmente!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;