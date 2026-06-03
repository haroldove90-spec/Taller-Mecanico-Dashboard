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
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Main states
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Active perspective
  const [activeRole, setActiveRole] = useState<'home' | 'reception' | 'mechanic' | 'admin'>('home');

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

  if (activeRole === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 md:p-12 font-sans" id="home-view">
        <div className="max-w-3xl w-full text-center space-y-12">
          {/* Logo & Name of Program */}
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md animate-fade-in">
              <Wrench size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
              Gestión de Taller
            </h1>
          </div>

          {/* 3 Icons and their Role name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Reception */}
            <button
              onClick={() => setActiveRole('reception')}
              className="bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs rounded-xl p-8 flex flex-col items-center gap-4 transition-all cursor-pointer group"
              id="home-role-reception"
            >
              <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 transition-all group-hover:bg-slate-900 group-hover:text-white">
                <UserSquare2 size={28} />
              </div>
              <span className="font-bold text-sm text-slate-800 uppercase tracking-wider group-hover:text-slate-900">Recepción</span>
            </button>

            {/* Mechanics */}
            <button
              onClick={() => setActiveRole('mechanic')}
              className="bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs rounded-xl p-8 flex flex-col items-center gap-4 transition-all cursor-pointer group"
              id="home-role-mechanic"
            >
              <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 transition-all group-hover:bg-slate-900 group-hover:text-white">
                <Wrench size={28} />
              </div>
              <span className="font-bold text-sm text-slate-800 uppercase tracking-wider group-hover:text-slate-900">Técnicos / Taller</span>
            </button>

            {/* Admin */}
            <button
              onClick={() => setActiveRole('admin')}
              className="bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs rounded-xl p-8 flex flex-col items-center gap-4 transition-all cursor-pointer group"
              id="home-role-admin"
            >
              <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <ShieldAlert size={28} />
              </div>
              <span className="font-bold text-sm text-slate-800 uppercase tracking-wider group-hover:text-slate-900">Administración</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 pb-12" id="app-root">
      {/* Premium minimal header */}
      <header className="bg-white border-b border-slate-200" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Elegant Back button & active perspective */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveRole('home')}
                className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2 text-xs sm:text-sm font-bold cursor-pointer shadow-3xs"
                id="back-to-home-btn"
                title="Volver al inicio"
              >
                <ArrowLeft size={15} />
                <span>Volver al Inicio</span>
              </button>

              <div className="h-6 w-px bg-slate-200"></div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                  {activeRole === 'reception' && <UserSquare2 className="w-4 h-4" />}
                  {activeRole === 'mechanic' && <Wrench className="w-4 h-4" />}
                  {activeRole === 'admin' && <ShieldAlert className="w-4 h-4" />}
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-none">
                    {activeRole === 'reception' && 'Recepción'}
                    {activeRole === 'mechanic' && 'Taller y Técnicos'}
                    {activeRole === 'admin' && 'Administración'}
                  </h1>
                </div>
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
