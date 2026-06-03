import React, { useState } from 'react';
import { Client, ServicePrice, Mechanic, Order, OrderService } from '../types';
import { 
  ClipboardPlus, 
  DollarSign, 
  Check, 
  Inbox, 
  Clock, 
  AlertCircle,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReceptionPanelProps {
  clients: Client[];
  services: ServicePrice[];
  mechanics: Mechanic[];
  orders: Order[];
  onCreateOrder: (order: Order) => void;
  onUpdateOrderPayment: (orderId: string, paymentStatus: 'Pagado' | 'Pendiente de pago', status?: 'Listo para entrega' | 'Entregado') => void;
  onDeliverOrder: (orderId: string) => void;
}

export default function ReceptionPanel({
  clients,
  services,
  mechanics,
  orders,
  onCreateOrder,
  onUpdateOrderPayment,
  onDeliverOrder
}: ReceptionPanelProps) {
  // Navigation inside Reception
  const [activeTab, setActiveTab] = useState<'create' | 'register'>('create');

  // Input states for New Order
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [assignedMechanicId, setAssignedMechanicId] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState('');

  // Search/Filter for orders
  const [filterCriteria, setFilterCriteria] = useState<'all' | 'pending' | 'ready'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Find vehicles for selected client
  const clientVehicles = clients.find(c => c.id === selectedClientId)?.vehicles || [];

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientId(e.target.value);
    setSelectedVehicleId(''); // Reset vehicle
  };

  const handleToggleService = (srvId: string) => {
    if (selectedServiceIds.includes(srvId)) {
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== srvId));
    } else {
      setSelectedServiceIds([...selectedServiceIds, srvId]);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      showAlert('error', 'Selecciona un cliente.');
      return;
    }
    if (!selectedVehicleId) {
      showAlert('error', 'Selecciona un vehículo.');
      return;
    }
    if (!issueDescription.trim()) {
      showAlert('error', 'Describe la falla reportada.');
      return;
    }
    if (!assignedMechanicId) {
      showAlert('error', 'Asigna un técnico.');
      return;
    }

    const orderServices: OrderService[] = selectedServiceIds.map(id => {
      const match = services.find(s => s.id === id);
      return {
        name: match?.name || 'Servicio General',
        price: match?.basePrice || 0
      };
    });

    if (orderServices.length === 0) {
      orderServices.push({ name: 'Diagnóstico Diagnóstico Inicial', price: 0 });
    }

    const newOrder: Order = {
      id: `OT-${1000 + orders.length + 10}`,
      clientId: selectedClientId,
      vehicleId: selectedVehicleId,
      issue: issueDescription.trim(),
      mechanicId: assignedMechanicId,
      status: 'En revisión',
      paymentStatus: 'Pendiente de pago',
      services: orderServices,
      notes: customNotes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    onCreateOrder(newOrder);
    showAlert('success', `Orden de entrada ${newOrder.id} creada.`);

    // Reset fields
    setSelectedClientId('');
    setSelectedVehicleId('');
    setIssueDescription('');
    setAssignedMechanicId('');
    setSelectedServiceIds([]);
    setCustomNotes('');
  };

  const getClientDetails = (id: string) => clients.find(c => c.id === id);
  const getVehicleDetails = (clientId: string, vehId: string) => {
    const c = clients.find(cl => cl.id === clientId);
    return c?.vehicles.find(v => v.id === vehId);
  };
  const getMechanicName = (id: string) => mechanics.find(m => m.id === id)?.name || 'Sin asignar';

  const calculateOrderTotal = (order: Order) => {
    return order.services.reduce((total, s) => total + s.price, 0);
  };

  const filteredOrders = orders.filter(order => {
    const client = getClientDetails(order.clientId);
    const vehicle = getVehicleDetails(order.clientId, order.vehicleId);
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCriteria === 'pending') {
      return order.paymentStatus === 'Pendiente de pago';
    }
    if (filterCriteria === 'ready') {
      return order.status === 'Listo para entrega';
    }
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden" id="reception-panel">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-150">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-4 text-center text-sm md:text-base font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="btn-recep-create"
        >
          <ClipboardPlus size={17} />
          1. Crear Orden de Entrada
        </button>
        <button
          onClick={() => {
            setActiveTab('register');
            setFilterCriteria('all');
          }}
          className={`flex-1 py-4 text-center text-sm md:text-base font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'register'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="btn-recep-register"
        >
          <DollarSign size={17} />
          2. Registrar Pago y Salida
        </button>
      </div>

      {/* Alert toast */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mx-5 mt-4 p-3 rounded-lg flex items-center gap-2.5 text-sm font-semibold ${
              alert.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100/50' : 'bg-rose-50 text-rose-800 border border-rose-100/50'
            }`}
          >
            {alert.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        {activeTab === 'create' ? (
          <form onSubmit={handleSubmitOrder} className="space-y-5 max-w-4xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Client & Vehicle select */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Información General</span>
                
                <div>
                  <label className="block text-xs md:text-sm text-slate-650 font-semibold mb-1">Cliente / Propietario *</label>
                  <select
                    value={selectedClientId}
                    onChange={handleClientChange}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-hidden focus:border-slate-900 text-slate-800 font-medium"
                  >
                    <option value="">-- Selecciona --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type === 'empresa' ? 'Empresa' : 'Particular'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-slate-650 font-semibold mb-1">Vehículo *</label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    required
                    disabled={!selectedClientId}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-hidden focus:border-slate-900 disabled:bg-slate-50 disabled:text-slate-400 text-slate-800 font-medium"
                  >
                    <option value="">
                      {!selectedClientId ? 'Primero selecciona un cliente' : '-- Selecciona --'}
                    </option>
                    {clientVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} &bull; {v.plate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-slate-650 font-semibold mb-1">Asignar Técnico *</label>
                  <select
                    value={assignedMechanicId}
                    onChange={(e) => setAssignedMechanicId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-hidden focus:border-slate-900 text-slate-800 font-medium"
                  >
                    <option value="">-- Selecciona --</option>
                    {mechanics.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} - ({m.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-slate-650 font-semibold mb-1">Falla Reportada *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe los ruidos o fallas observadas..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900 resize-none font-sans text-slate-800 leading-relaxed"
                  />
                </div>
              </div>

              {/* Right Column: Preselect Services */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Servicios del Catálogo</span>
                
                <div className="space-y-1.5 max-h-[190px] overflow-y-auto border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                  {services.map(srv => {
                    const isChecked = selectedServiceIds.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleToggleService(srv.id)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none text-sm ${
                          isChecked
                            ? 'bg-slate-900 text-white border-slate-950 shadow-3xs'
                            : 'bg-white border-slate-155 hover:border-slate-250 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-1.5">
                            <span className="font-semibold block truncate">{srv.name}</span>
                            <span className={`font-mono text-xs font-bold ${isChecked ? 'text-slate-300' : 'text-slate-550'} shrink-0`}>
                              ${srv.basePrice.toLocaleString('es-MX')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-slate-655 font-semibold mb-1">Notas Internas</label>
                  <textarea
                    rows={2}
                    placeholder="Límite de crédito, requisitos corporativos, etc."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900 resize-none text-slate-800"
                  />
                </div>

                {/* Live total display */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 flex items-center justify-between text-sm shadow-3xs">
                  <span className="font-semibold text-slate-500">Presupuesto Estimado:</span>
                  <span className="font-mono text-slate-900 font-extrabold text-base">
                    ${selectedServiceIds
                      .reduce((sum, id) => sum + (services.find(s => s.id === id)?.basePrice || 0), 0)
                      .toLocaleString('es-MX')} MXN
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <ClipboardPlus size={16} />
                Registrar Entrada de Orden
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-150 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cobranza Activa</span>
              </div>

              {/* Minimal filter badges */}
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setFilterCriteria('all')}
                  className={`px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                    filterCriteria === 'all'
                      ? 'bg-slate-900 text-white border-slate-950 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Todos ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCriteria('pending')}
                  className={`px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                    filterCriteria === 'pending'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Pendientes ({orders.filter(o => o.paymentStatus === 'Pendiente de pago').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCriteria('ready')}
                  className={`px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                    filterCriteria === 'ready'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Listos ({orders.filter(o => o.status === 'Listo para entrega' && o.paymentStatus !== 'Pagado').length})
                </button>
              </div>
            </div>

            {/* Quick search */}
            <input
              type="text"
              placeholder="Filtro rápido (placa, cliente, folio)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-950 text-slate-800"
            />

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-14 text-slate-400 border border-dashed border-slate-200 rounded-lg text-sm bg-slate-50/20" id="empty-reception-orders">
                  <Inbox size={28} className="mx-auto text-slate-300 mb-2" />
                  No hay órdenes registradas bajo este filtro.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const client = getClientDetails(order.clientId);
                  const vehicle = getVehicleDetails(order.clientId, order.vehicleId);
                  const total = calculateOrderTotal(order);

                  return (
                    <div
                      key={order.id}
                      className="border border-slate-200/80 rounded-xl p-5 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col lg:flex-row justify-between gap-6 text-sm shadow-3xs"
                      id={`order-checkout-card-${order.id}`}
                    >
                      {/* Left Block */}
                      <div className="flex-1 space-y-3.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono bg-white border border-slate-200 text-slate-800 text-xs font-extrabold px-2.5 py-1 rounded-md shadow-3xs">
                            {order.id}
                          </span>
                          
                          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                            order.paymentStatus === 'Pagado'
                              ? 'bg-emerald-100/60 text-emerald-800 border-emerald-200/60'
                              : 'bg-rose-100/60 text-rose-800 border-rose-200/60'
                          }`}>
                            {order.paymentStatus}
                          </span>

                          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                            order.status === 'En revisión'
                              ? 'bg-amber-100/50 text-amber-805 border-amber-200/50'
                              : order.status === 'Reparando'
                              ? 'bg-blue-100/50 text-blue-805 border-blue-200/50'
                              : 'bg-emerald-100/60 text-emerald-805 border-emerald-200/60'
                          }`}>
                            🔧 {order.status}
                          </span>
                        </div>

                        {/* Customer & Car indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-slate-500 leading-relaxed pt-1">
                          <div>
                            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Cliente</span>
                            <span className="font-bold text-slate-800 block text-base leading-snug">{client?.name}</span>
                            <span className="text-xs text-slate-500">Tipo: {client?.type === 'empresa' ? 'Empresa' : 'Particular'} &bull; Tel: {client?.phone}</span>
                          </div>

                          <div>
                            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Vehículo</span>
                            <span className="font-bold text-slate-800 block text-base leading-snug">{vehicle?.brand} {vehicle?.model}</span>
                            <span className="text-xs text-slate-500">Año: {vehicle?.year} &bull; Placa: <strong className="font-mono bg-white px-2 py-0.5 border border-slate-200 rounded-md shadow-3xs text-slate-700">{vehicle?.plate}</strong></span>
                          </div>
                        </div>

                        {/* Observed fault */}
                        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-150 shadow-3xs">
                          <span className="text-xs text-slate-400 font-bold block mb-1">Falla Reportada</span>
                          <p className="text-slate-700 italic text-sm font-sans leading-relaxed">
                            &ldquo;{order.issue}&rdquo;
                          </p>
                        </div>
                        
                        <span className="text-xs md:text-sm text-slate-400 block pb-1 border-b border-slate-100/50">
                          Mecánico asignado: <strong className="text-slate-700 font-semibold">{getMechanicName(order.mechanicId)}</strong>
                        </span>
                      </div>

                      {/* Right Block */}
                      <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-5 flex flex-col justify-between py-1 gap-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Servicios Programados</p>
                          <div className="space-y-2 mb-3 max-h-[140px] overflow-y-auto pr-0.5 text-xs md:text-sm">
                            {order.services.map((item, id) => (
                              <div key={id} className="flex justify-between text-slate-650 hover:bg-slate-100/30 py-0.5 px-1 rounded transition-colors">
                                <span className="truncate max-w-[170px] font-medium">{item.name}</span>
                                <span className="font-mono text-slate-700">${item.price.toLocaleString('es-MX')}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center text-sm font-extrabold border-t border-slate-200 pt-2.5 text-slate-800">
                            <span>Total Cobro:</span>
                            <span className="font-mono text-slate-900 text-base md:text-lg">${total.toLocaleString('es-MX')}</span>
                          </div>
                        </div>

                        {/* Checkout Trigger triggers */}
                        <div className="space-y-2">
                          {order.paymentStatus === 'Pendiente de pago' ? (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateOrderPayment(order.id, 'Pagado');
                                showAlert('success', `Pago de la orden ${order.id} registrado con éxito.`);
                              }}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                            >
                              <CreditCard size={15} />
                              Registrar Pago
                            </button>
                          ) : (
                            <div className="text-center py-2 text-xs md:text-sm text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-100/50 font-bold shadow-3xs">
                              Pagado con éxito ✅
                            </div>
                          )}

                          {order.status === 'Listo para entrega' && order.paymentStatus === 'Pagado' ? (
                            <button
                              type="button"
                              onClick={() => {
                                onDeliverOrder(order.id);
                                showAlert('success', `Automóvil de ${client?.name} entregado exitosamente.`);
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <ArrowRight size={15} />
                              Confirmar Salida y Entrega
                            </button>
                          ) : order.status === 'Listo para entrega' && order.paymentStatus === 'Pendiente de pago' ? (
                            <div className="text-center text-xs text-slate-500 bg-slate-100/80 p-2 rounded-lg border border-slate-200 font-semibold shadow-3xs">
                              Falta pago para dar entrega
                            </div>
                          ) : (
                            <div className="text-center text-xs text-slate-400 p-1.5 font-medium">
                              Fase actual: <strong className="text-slate-600 uppercase text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">{order.status}</strong>
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
        )}
      </div>
    </div>
  );
}
