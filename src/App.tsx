/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  ClipboardCheck, 
  RefreshCw,
  Zap,
  CheckCircle,
  HelpCircle,
  History,
  TrendingUp,
  X
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

  // History slide over state (To keep track of historically closed orders)
  const [showHistory, setShowHistory] = useState(false);

  // Guide helper
  const [showGuide, setShowGuide] = useState(true);

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

  // Save changes helper
  const saveToStorage = (key: string, data: any, setter: Function) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Add / Delete Client
  const handleAddClient = (newClient: Client) => {
    const updated = [newClient, ...clients];
    saveToStorage('taller_clients', updated, setClients);
  };

  const handleDeleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    saveToStorage('taller_clients', updated, setClients);
  };

  // Add / Delete Service
  const handleAddService = (newService: ServicePrice) => {
    const updated = [newService, ...services];
    saveToStorage('taller_services', updated, setServices);
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    saveToStorage('taller_services', updated, setServices);
  };

  // Create Order (Reception Step 1)
  const handleCreateOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    saveToStorage('taller_orders', updated, setOrders);
  };

  // Update Mechanic Status (Mechanic Step 2)
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

  // Register Payment (Reception Step 3a)
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

  // Deliver Car and archive order (Reception Step 3b)
  const handleDeliverOrder = (orderId: string) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        // We set status to a custom state representing closed "Entregado"
        return { ...order, status: 'Listo para entrega' as const, completedAt: order.completedAt || new Date().toISOString() };
      }
      return order;
    });
    
    // For this prototype, we'll mark it as a separate flag or we can mark it as closed,
    // let's add a special 'archived' property or simply change the status so it goes to historical list!
    // To keep it simple, we can filter out from live orders but let receptionist view 'historial' via a side pane.
    // Let's make an 'entregado' state. Since 'OrderStatus' has 'Listo para entrega', let's represent 'Entregado' in index
    // as a special delivered field state:
    const deliveredUpdated = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, isDelivered: true };
      }
      return order;
    });
    
    saveToStorage('taller_orders', deliveredUpdated, setOrders);
  };

  // Reset to initial Seed Data
  const handleResetData = () => {
    if (confirm('¿Deseas restaurar los datos iniciales del simulador? Esto borrará tus cambios actuales.')) {
      setClients(INITIAL_CLIENTS);
      setServices(INITIAL_SERVICES);
      setMechanics(INITIAL_MECHANICS);
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('taller_clients', JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem('taller_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem('taller_mechanics', JSON.stringify(INITIAL_MECHANICS));
      localStorage.setItem('taller_orders', JSON.stringify(INITIAL_ORDERS));
      alert('Datos restaurados con éxito.');
    }
  };

  // Separation between live orders and delivered orders
  const liveOrders = orders.filter(o => !(o as any).isDelivered);
  const archivedOrders = orders.filter(o => (o as any).isDelivered);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12" id="app-root">
      
      {/* Visual Navigation Header */}
      <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 p-2.5 rounded-xl shadow-md border border-amber-300">
                <Wrench className="w-6 h-6 stroke-3" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                  TALLER MECÁNICO CONTROL
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-bold font-mono px-2 py-0.5 rounded-sm border border-amber-500/30">
                    SISTEMA LOCAL
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Control de Clientes, Servicios, Asignación de Tareas y Cobros</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  showGuide 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Mostrar guía de flujo de trabajo"
              >
                <HelpCircle size={14} />
                <span>Guía del Flujo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <History size={14} />
                Historial Entregas ({archivedOrders.length})
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="bg-slate-800/60 hover:bg-rose-950/40 text-rose-300/90 hover:text-rose-200 border border-slate-700/60 hover:border-rose-900/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                title="Restaurar datos de muestra"
              >
                <RefreshCw size={13} />
                Reiniciar Simulación
              </button>
            </div>
          </div>

          {/* Role Navigation Controls (Administrador, Recepcionista, Mecánico) */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
            <button
              onClick={() => setActiveRole('reception')}
              className={`px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all relative ${
                activeRole === 'reception'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              id="role-tab-reception"
            >
              <UserSquare2 size={16} />
              <span>Rol: Recepcionista 💼</span>
              {liveOrders.filter(o => o.status === 'Listo para entrega' && o.paymentStatus !== 'Pagado').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  !
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveRole('mechanic')}
              className={`px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                activeRole === 'mechanic'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              id="role-tab-mechanic"
            >
              <Wrench size={16} />
              <span>Rol: Técnico / Mecánico 🔧</span>
            </button>

            <button
              onClick={() => setActiveRole('admin')}
              className={`px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                activeRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              id="role-tab-admin"
            >
              <ShieldAlert size={16} />
              <span>Rol: Administrador / Dueño 👑</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content & Stats */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        
        {/* Interactive Step Guide Banner */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6 text-slate-800 overflow-hidden relative"
              id="workflow-guide-banner"
            >
              <button
                onClick={() => setShowGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                title="Ocultar guía"
              >
                <X size={16} />
              </button>
              
              <div className="flex gap-3">
                <div className="bg-amber-400 text-slate-900 p-2 rounded-xl h-fit">
                  <Zap size={18} className="stroke-2" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">
                    🔄 El Ciclo Completo en 3 Pasos (Guía Interactiva)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-4xl">
                    Esta guía te enseña cómo el sistema unifica cada rol. Sigue los pasos numerados para ver el flujo en acción inmediata:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/80 border border-slate-100 p-3.5 rounded-xl flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block mb-0.5">Creación del Caso</span>
                        En el panel del <strong className="text-indigo-600 cursor-pointer" onClick={() => setActiveRole('reception')}>Recepcionista</strong>, crea una Orden seleccionando un auto, asignándole un mecánico e indicando los servicios requeridos.
                      </div>
                    </div>

                    <div className="bg-white/80 border border-slate-100 p-3.5 rounded-xl flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block mb-0.5">Atención en Taller</span>
                        Pásate al panel de <strong className="text-indigo-600 cursor-pointer" onClick={() => setActiveRole('mechanic')}>Técnico</strong>. Selecciona al mecánico asignado en el filtro. Comienza el trabajo y cámbialo a <strong>"Listo para entrega"</strong> al terminar.
                      </div>
                    </div>

                    <div className="bg-white/80 border border-slate-100 p-3.5 rounded-xl flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block mb-0.5">Cobro y Cierre</span>
                        Regresa a la pestaña de <strong className="text-indigo-600 cursor-pointer" onClick={() => setActiveRole('reception')}>Recepcionista</strong> (Sección Cobros). Registra el pago del cliente y entrégale el automóvil para archivar la orden en el historial.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Global KPI cards */}
        <StatsOverview orders={orders} />

        {/* Active view placement */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
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

      {/* Slideout Panel - Delivery History */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="history-modal">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black"
            ></motion.div>

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-amber-500" />
                    <h3 className="font-bold text-base font-display">Historial de Autos Entregados</h3>
                  </div>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="text-slate-400 hover:text-white transition-all p-1"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {archivedOrders.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <ClipboardCheck size={36} className="mx-auto text-slate-300 mb-2" />
                      Aún no hay autos en el historial. 
                      <p className="text-xs text-slate-400 mt-1">Completa órdenes e inicia la entrega para verlas listadas aquí.</p>
                    </div>
                  ) : (
                    archivedOrders.map((ord) => {
                      const client = clients.find(c => c.id === ord.clientId);
                      const vehicle = client?.vehicles.find(v => v.id === ord.vehicleId);
                      const total = ord.services.reduce((sm, s) => sm + s.price, 0);

                      return (
                        <div key={ord.id} className="border border-slate-200 p-4 rounded-xl bg-slate-50 relative">
                          <span className="absolute top-4 right-4 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                            <CheckCircle size={10} />
                            Entregado
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-600 block mb-1">{ord.id}</span>
                          
                          <p className="text-sm font-bold text-slate-900">{client?.name}</p>
                          <p className="text-xs text-slate-500">{vehicle?.brand} {vehicle?.model} - [{vehicle?.plate}]</p>
                          
                          <div className="mt-2 text-xs border-t border-slate-200/60 pt-2 space-y-1">
                            <span className="block text-slate-500"><strong>Trabajo:</strong> {ord.issue}</span>
                            <span className="block font-semibold text-slate-800">Costo Final Cobrado: <strong className="font-mono text-indigo-600">${total.toLocaleString('es-MX')} MXN</strong></span>
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

