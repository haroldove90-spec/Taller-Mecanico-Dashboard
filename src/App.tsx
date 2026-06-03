import { useState, useEffect } from 'react';
import { Client, ServicePrice, Mechanic, Order } from './types';
import { 
  INITIAL_CLIENTS, 
  INITIAL_SERVICES, 
  INITIAL_MECHANICS, 
  INITIAL_ORDERS 
} from './initialData';
import StatsOverview from './components/StatsOverview';
import AdminPanel from './components/AdminPanel';
import ReceptionPanel from './components/ReceptionPanel';
import MechanicPanel from './components/MechanicPanel';
import { 
  Wrench, 
  UserSquare2, 
  ShieldAlert, 
  RefreshCw,
  History,
  X,
  PlusCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Main states
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Active perspective
  const [activeRole, setActiveRole] = useState<'reception' | 'mechanic' | 'admin'>('reception');

  // History state
  const [showHistory, setShowHistory] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedClients = localStorage.getItem('taller_clients');
    const storedServices = localStorage.getItem('taller_services');
    const storedMechanics = localStorage.getItem('taller_mechanics');
    const storedOrders = localStorage.getItem('taller_orders');

    if (storedClients) setClients(JSON.parse(storedClients));
    else {
      setClients(INITIAL_CLIENTS);
      localStorage.setItem('taller_clients', JSON.stringify(INITIAL_CLIENTS));
    }

    if (storedServices) setServices(JSON.parse(storedServices));
    else {
      setServices(INITIAL_SERVICES);
      localStorage.setItem('taller_services', JSON.stringify(INITIAL_SERVICES));
    }

    if (storedMechanics) setMechanics(JSON.parse(storedMechanics));
    else {
      setMechanics(INITIAL_MECHANICS);
      localStorage.setItem('taller_mechanics', JSON.stringify(INITIAL_MECHANICS));
    }

    if (storedOrders) setOrders(JSON.parse(storedOrders));
    else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('taller_orders', JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  const saveToStorage = (key: string, data: any, setter: Function) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAddClient = (newClient: Client) => {
    const updated = [newClient, ...clients];
    saveToStorage('taller_clients', updated, setClients);
  };

  const handleDeleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    saveToStorage('taller_clients', updated, setClients);
  };

  const handleAddService = (newService: ServicePrice) => {
    const updated = [newService, ...services];
    saveToStorage('taller_services', updated, setServices);
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    saveToStorage('taller_services', updated, setServices);
  };

  const handleCreateOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    saveToStorage('taller_orders', updated, setOrders);
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'En revisión' | 'Reparando' | 'Listo para entrega') => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        const completedAt = status === 'Listo para entrega' ? new Date().toISOString() : order.completedAt;
        return { ...order, status, completedAt };
      }
      return order;
    });
    saveToStorage('taller_orders', updated, setOrders);
  };

  const handleUpdateOrderPayment = (
    orderId: string, 
    paymentStatus: 'Pagado' | 'Pendiente de pago'
  ) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, paymentStatus };
      }
      return order;
    });
    saveToStorage('taller_orders', updated, setOrders);
  };

  const handleDeliverOrder = (orderId: string) => {
    const deliveredUpdated = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, isDelivered: true };
      }
      return order;
    });
    saveToStorage('taller_orders', deliveredUpdated, setOrders);
  };

  const handleResetData = () => {
    if (confirm('¿Deseas restaurar los datos iniciales? Se perderán todos tus cambios.')) {
      setClients(INITIAL_CLIENTS);
      setServices(INITIAL_SERVICES);
      setMechanics(INITIAL_MECHANICS);
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('taller_clients', JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem('taller_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem('taller_mechanics', JSON.stringify(INITIAL_MECHANICS));
      localStorage.setItem('taller_orders', JSON.stringify(INITIAL_ORDERS));
    }
  };

  const liveOrders = orders.filter(o => !(o as any).isDelivered);
  const archivedOrders = orders.filter(o => (o as any).isDelivered);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 pb-12" id="app-root">
      {/* Premium minimal header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Elegant Branding without flashy tags */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 font-display">
                  Gestión de Taller
                </h1>
                <p className="text-xs md:text-sm text-slate-400">Control unificado de servicios y reparaciones</p>
              </div>
            </div>

            {/* Clean top-most action items */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-2 transition-all bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-lg border border-slate-200 cursor-pointer"
              >
                <History size={15} />
                <span>Historial ({archivedOrders.length})</span>
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="text-sm font-medium text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-all bg-transparent hover:bg-rose-50 px-3 py-2 rounded-lg cursor-pointer"
                title="Restaurar datos de muestra"
              >
                <RefreshCw size={14} />
                <span>Restaurar</span>
              </button>
            </div>

          </div>

          {/* Minimalist Tab Navigation */}
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            <button
              onClick={() => setActiveRole('reception')}
              className={`px-5 py-2.5 rounded-lg text-sm md:text-base font-medium flex items-center gap-2 transition-all cursor-pointer ${
                activeRole === 'reception'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="role-tab-reception"
            >
              <UserSquare2 size={16} />
              <span>Recepción</span>
              {liveOrders.filter(o => o.status === 'Listo para entrega' && o.paymentStatus !== 'Pagado').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveRole('mechanic')}
              className={`px-5 py-2.5 rounded-lg text-sm md:text-base font-medium flex items-center gap-2 transition-all cursor-pointer ${
                activeRole === 'mechanic'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="role-tab-mechanic"
            >
              <Wrench size={16} />
              <span>Técnicos / Taller</span>
            </button>

            <button
              onClick={() => setActiveRole('admin')}
              className={`px-5 py-2.5 rounded-lg text-sm md:text-base font-medium flex items-center gap-2 transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="role-tab-admin"
            >
              <ShieldAlert size={16} />
              <span>Administración</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 w-full">
        {/* Compact stats strip */}
        <StatsOverview orders={orders} />

        {/* View render containing role specific panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            {activeRole === 'admin' && (
              <AdminPanel
                clients={clients}
                services={services}
                onAddClient={handleAddClient}
                onAddService={handleAddService}
                onDeleteClient={handleDeleteClient}
                onDeleteService={handleDeleteService}
              />
            )}

            {activeRole === 'reception' && (
              <ReceptionPanel
                clients={clients}
                services={services}
                mechanics={mechanics}
                orders={liveOrders}
                onCreateOrder={handleCreateOrder}
                onUpdateOrderPayment={handleUpdateOrderPayment}
                onDeliverOrder={handleDeliverOrder}
              />
            )}

            {activeRole === 'mechanic' && (
              <MechanicPanel
                mechanics={mechanics}
                orders={liveOrders}
                clients={clients}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide-out delivery history log */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="history-modal">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black"
            ></motion.div>

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                className="w-screen max-w-sm bg-white border-l border-slate-200 flex flex-col shadow-xl"
              >
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider font-display">Historial de Salidas</span>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="text-slate-400 hover:text-slate-600 transition-all p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                  {archivedOrders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <Clock size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs">No hay entregas en el historial todavía.</p>
                    </div>
                  ) : (
                    archivedOrders.map((ord) => {
                      const client = clients.find(c => c.id === ord.clientId);
                      const vehicle = client?.vehicles.find(v => v.id === ord.vehicleId);
                      const total = ord.services.reduce((sm, s) => sm + s.price, 0);

                      return (
                        <div key={ord.id} className="border border-slate-100 p-3.5 rounded-lg bg-slate-50 relative text-xs">
                          <span className="absolute top-3.5 right-3.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50 flex items-center gap-0.5">
                            <CheckCircle2 size={10} />
                            Entregado
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 block mb-1">{ord.id}</span>
                          
                          <p className="font-bold text-slate-800">{client?.name}</p>
                          <p className="text-slate-500 mt-0.5">{vehicle?.brand} {vehicle?.model} &bull; {vehicle?.plate}</p>
                          
                          <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[11px] space-y-1">
                            <p className="text-slate-600"><span className="text-slate-400">Trabajo:</span> {ord.issue}</p>
                            <p className="font-semibold text-slate-800">Costo total cobrado: <strong className="font-mono text-slate-900 font-bold">${total.toLocaleString('es-MX')}</strong></p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
