import React, { useState } from 'react';
import { Mechanic, Order, Client, Vehicle } from '../types';
import { 
  Wrench, 
  User, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Clock,
  Briefcase,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MechanicPanelProps {
  mechanics: Mechanic[];
  orders: Order[];
  clients: Client[];
  onUpdateOrderStatus: (orderId: string, status: 'En revisión' | 'Reparando' | 'Listo para entrega') => void;
}

export default function MechanicPanel({
  mechanics,
  orders,
  clients,
  onUpdateOrderStatus
}: MechanicPanelProps) {
  // Active mechanic logged-in/selected
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>(mechanics[0]?.id || '');
  
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (message: string) => {
    setAlert({ type: 'success', message });
    setTimeout(() => setAlert(null), 3000);
  };

  const getClientDetails = (id: string) => clients.find(c => c.id === id);
  const getVehicleDetails = (clientId: string, vehId: string) => {
    const c = clients.find(cl => cl.id === clientId);
    return c?.vehicles.find(v => v.id === vehId);
  };

  // Filter orders assigned to this mechanic and not already closed (we don't want to clutter with historical orders unless list is empty, let's keep it live)
  const myActiveOrders = orders.filter(
    order => order.mechanicId === selectedMechanicId
  );

  const selectedMechanic = mechanics.find(m => m.id === selectedMechanicId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="mechanic-panel">
      {/* Header with Selector */}
      <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Wrench size={22} className="text-indigo-600 animate-pulse" />
            Terminal del Técnico / Mecánico 🔧
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Revisa tu lista digital de vehículos asignados y actualiza su estatus en tiempo real.
          </p>
        </div>

        {/* Mechanic selector mimicking a tablet-bay login */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 uppercase shrink-0">Identificación:</label>
          <select
            value={selectedMechanicId}
            onChange={(e) => setSelectedMechanicId(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-800 focus:outline-hidden focus:border-indigo-500 shadow-xs"
            id="mechanic-user-selector"
          >
            {mechanics.map(m => (
              <option key={m.id} value={m.id}>
                👨‍🔧 {m.name} ({m.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert toast */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 text-sm bg-indigo-50 text-indigo-800 border border-indigo-100"
          >
            <CheckCircle2 size={18} className="text-indigo-600" />
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-600">
            Técnico activo: <strong className="text-slate-800">{selectedMechanic?.name}</strong>
          </span>
          <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
            {myActiveOrders.length} {myActiveOrders.length === 1 ? 'Auto Asignado' : 'Autos Asignados'}
          </span>
        </div>

        {/* List of Tasks */}
        <div className="space-y-4">
          {myActiveOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl" id="empty-mechanic-orders">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
              <p className="font-bold text-slate-800 text-sm">¡Excelente trabajo!</p>
              <p className="text-xs">No tienes autos asignados ni pendientes para hoy.</p>
            </div>
          ) : (
            myActiveOrders.map((order, index) => {
              const client = getClientDetails(order.clientId);
              const vehicle = getVehicleDetails(order.clientId, order.vehicleId);

              return (
                <div
                  key={order.id}
                  className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row justify-between gap-6"
                  id={`mechanic-task-card-${order.id}`}
                >
                  {/* Left Column: Order details & car information */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-md">
                        {order.id}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Clock size={12} />
                        Ingreso: {new Date(order.createdAt).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {/* Animated Badge depending on status */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        order.status === 'En revisión'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : order.status === 'Reparando'
                          ? 'border-indigo-200 bg-indigo-100 text-indigo-800 font-bold'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Reparando' ? 'bg-indigo-600 animate-ping' : order.status === 'En revisión' ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}`}></span>
                        {order.status}
                      </span>
                    </div>

                    {/* Client & Car description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehículo Asignado</p>
                        <p className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                          <Car size={14} className="text-indigo-600" />
                          {vehicle?.brand} {vehicle?.model}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Año: {vehicle?.year} | Placas: <strong className="font-mono bg-slate-200/80 px-1.5 py-0.5 rounded-sm text-slate-800 font-bold">{vehicle?.plate}</strong>
                        </p>
                      </div>

                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto / Cliente</p>
                        <p className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                          <User size={14} className="text-slate-600" />
                          {client?.name}
                        </p>
                        <p className="text-xs text-slate-400 capitalize mt-0.5">{client?.type} | {client?.phone}</p>
                      </div>
                    </div>

                    {/* Reported Fault */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <FileText size={12} className="text-slate-400" />
                        Falla Reportada y Diagnóstico Inicial:
                      </p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 border border-slate-100 rounded-xl font-medium leading-relaxed">
                        "{order.issue}"
                      </p>
                    </div>

                    {/* Selected services */}
                    {order.services.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                          <Briefcase size={12} className="text-slate-400" />
                          Trabajos Programados:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {order.services.map((item, id) => (
                            <span key={id} className="text-[10px] bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200/60 font-medium">
                              🛠️ {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Status Switch / Interactive buttons */}
                  <div className="md:w-64 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 flex flex-col justify-center gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
                      Progreso de la Reparación
                    </p>

                    {/* Progress visual bar */}
                    <div className="flex items-center justify-between w-full px-2">
                      <div className={`p-2 rounded-full ${order.status === 'En revisión' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-indigo-50 text-indigo-400'}`}>
                        <Clock size={16} />
                      </div>
                      <div className={`flex-1 h-1 mx-1 rounded-full ${order.status !== 'En revisión' ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                      <div className={`p-2 rounded-full ${order.status === 'Reparando' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : order.status === 'Listo para entrega' ? 'bg-indigo-50 text-indigo-400' : 'bg-slate-100 text-slate-400'}`}>
                        <Wrench size={16} />
                      </div>
                      <div className={`flex-1 h-1 mx-1 rounded-full ${order.status === 'Listo para entrega' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                      <div className={`p-2 rounded-full ${order.status === 'Listo para entrega' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                        <CheckCircle2 size={16} />
                      </div>
                    </div>

                    {/* Trigger Buttons */}
                    <div className="space-y-2 mt-2">
                      {order.status === 'En revisión' && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'Reparando');
                            showAlert(`🚘 Orden ${order.id} iniciada. Estado cambiado a "Reparando".`);
                          }}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                        >
                          <Play size={14} className="fill-current" />
                          Comenzar Reparación 🛠️
                        </button>
                      )}

                      {order.status === 'Reparando' && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'Listo para entrega');
                            showAlert(`✅ ¡Trabajo concluido para la orden ${order.id}! El auto está listo para entrega.`);
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          Terminar y Marcar Listo 🏁
                        </button>
                      )}

                      {order.status === 'Listo para entrega' && (
                        <div className="text-center p-3 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={16} className="text-emerald-600 stroke-3" />
                          ¡Auto terminado y listo!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
