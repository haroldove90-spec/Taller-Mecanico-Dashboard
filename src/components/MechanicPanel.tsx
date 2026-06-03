import React, { useState } from 'react';
import { Mechanic, Order, Client } from '../types';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
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
  // Active mechanic selector state
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

  const myActiveOrders = orders.filter(
    order => order.mechanicId === selectedMechanicId
  );

  const selectedMechanic = mechanics.find(m => m.id === selectedMechanicId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden" id="mechanic-panel">
      {/* Header Selector bar */}
      <div className="p-5 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/40">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans">Panel del Mecánico</span>
          <p className="text-sm text-slate-500 mt-0.5">Asignación digital de labores y avance de reparaciones</p>
        </div>

        {/* Login selection mimicking mechanic check-in */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs uppercase font-extrabold text-slate-400">Técnico:</label>
          <select
            value={selectedMechanicId}
            onChange={(e) => setSelectedMechanicId(e.target.value)}
            className="px-3.5 py-2 border border-slate-200 rounded-lg bg-white text-sm font-bold text-slate-800 focus:outline-hidden cursor-pointer shadow-2xs"
            id="mechanic-user-selector"
          >
            {mechanics.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert toast */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-5 mt-4 p-3 rounded-lg flex items-center gap-2.5 text-sm font-semibold bg-slate-905 text-white"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        <div className="mb-4 flex justify-between items-center text-sm md:text-base font-medium">
          <span className="text-slate-500">
            Tallerista activo: <strong className="text-slate-900 font-bold">{selectedMechanic?.name}</strong>
          </span>
          <span className="text-slate-650 bg-slate-100 font-bold px-3 py-1 rounded-full text-xs font-mono border border-slate-200/50">
            {myActiveOrders.length} {myActiveOrders.length === 1 ? 'Auto Asignado' : 'Autos Asignados'}
          </span>
        </div>

        {/* Task cards */}
        <div className="space-y-4">
          {myActiveOrders.length === 0 ? (
            <div className="text-center py-14 text-slate-400 border border-dashed border-slate-200 rounded-lg text-sm bg-slate-50/20" id="empty-mechanic-orders">
              <CheckCircle2 size={32} className="mx-auto text-slate-300 mb-2.5" />
              <p className="font-bold text-slate-700 text-base">Sin pendientes en la cola de trabajo</p>
              <p className="text-xs text-slate-400 mt-1">Los autos asignados por recepción aparecerán aquí.</p>
            </div>
          ) : (
            myActiveOrders.map((order) => {
              const client = getClientDetails(order.clientId);
              const vehicle = getVehicleDetails(order.clientId, order.vehicleId);

              return (
                <div
                  key={order.id}
                  className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col lg:flex-row justify-between gap-5 text-sm shadow-2xs"
                  id={`mechanic-task-card-${order.id}`}
                >
                  {/* Left block Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono bg-white border border-slate-205 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md shadow-2xs">
                        {order.id}
                      </span>
                      
                      <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                        order.status === 'En revisión'
                          ? 'bg-amber-105 text-amber-800 border-amber-200'
                          : order.status === 'Reparando'
                          ? 'bg-slate-900 text-white border-slate-950 font-semibold'
                          : 'bg-emerald-110 text-emerald-800 border-emerald-250'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Car Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm leading-relaxed">
                      <div>
                        <span className="text-xs text-slate-405 font-bold uppercase tracking-wider block mb-0.5">Vehículo</span>
                        <span className="font-extrabold text-slate-805 text-base leading-snug">{vehicle?.brand} {vehicle?.model} &bull; {vehicle?.year}</span>
                        <span className="font-mono text-xs text-slate-500 mt-1 block">Placas: <strong className="bg-white border px-1.5 py-0.5 rounded text-slate-700 border-slate-205 shadow-2xs">{vehicle?.plate}</strong></span>
                      </div>

                      <div>
                        <span className="text-xs text-slate-405 font-bold uppercase tracking-wider block mb-0.5">Propietario / Cliente</span>
                        <span className="font-extrabold text-slate-805 text-base leading-snug">{client?.name}</span>
                        <span className="text-slate-500 text-xs mt-1 block">Tipo: {client?.type === 'empresa' ? 'Empresa' : 'Particular'} &bull; Tel: {client?.phone}</span>
                      </div>
                    </div>

                    {/* Falla */}
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-150 shadow-2xs">
                      <strong className="text-xs text-slate-405 uppercase tracking-widest block mb-1">Falla Reportada:</strong>
                      <p className="text-slate-700 font-sans italic leading-relaxed text-sm">
                        &ldquo;{order.issue}&rdquo;
                      </p>
                    </div>

                    {/* Scheduled Services items */}
                    {order.services.length > 0 && (
                      <div className="space-y-1.5">
                        <strong className="text-xs text-slate-405 uppercase tracking-widest block font-bold">Servicios a realizar:</strong>
                        <div className="flex flex-wrap gap-2">
                          {order.services.map((item, id) => (
                            <span key={id} className="text-xs bg-white text-slate-750 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-3xs">
                              &bull; {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right block Actions progress status */}
                  <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-5 flex flex-col justify-center py-2 gap-4">
                    <p className="text-xs font-bold text-slate-405 uppercase tracking-widest text-center lg:text-left">
                      Avance Técnico
                    </p>

                    {/* Mini progress line indicator */}
                    <div className="flex items-center justify-between w-full px-2">
                      <div className={`p-2 rounded-lg ${order.status === 'En revisión' ? 'bg-amber-105 text-amber-800 border border-amber-200' : 'bg-slate-100/80 text-slate-400'}`} title="En revisión">
                        <Clock size={14} />
                      </div>
                      <div className={`flex-1 h-0.5 mx-1 transition-all ${order.status !== 'En revisión' ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                      <div className={`p-2 rounded-lg ${order.status === 'Reparando' ? 'bg-slate-900 text-white' : 'bg-slate-100/80 text-slate-400'}`} title="Reparando">
                        <Wrench size={14} />
                      </div>
                      <div className={`flex-1 h-0.5 mx-1 transition-all ${order.status === 'Listo para entrega' ? 'bg-emerald-550' : 'bg-slate-200'}`}></div>
                      <div className={`p-2 rounded-lg ${order.status === 'Listo para entrega' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100/80 text-slate-400'}`} title="Listo para entrega">
                        <CheckCircle2 size={14} />
                      </div>
                    </div>

                    {/* Actions trigger */}
                    <div className="pt-2">
                      {order.status === 'En revisión' && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'Reparando');
                            showAlert(`Servicio ${order.id} marcado como "Reparando".`);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Play size={13} className="fill-current" />
                          Iniciar Trabajo
                        </button>
                      )}

                      {order.status === 'Reparando' && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'Listo para entrega');
                            showAlert(`Orden ${order.id} concluida.`);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 size={14} />
                          Terminar Reparación
                        </button>
                      )}

                      {order.status === 'Listo para entrega' && (
                        <div className="text-center p-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-100/50 flex items-center justify-center gap-1.5 shadow-2xs">
                          Listo para Salida ✅
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
