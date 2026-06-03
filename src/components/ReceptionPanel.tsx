import React, { useState } from 'react';
import { Client, ServicePrice, Mechanic, Order, OrderService, Vehicle } from '../types';
import { 
  ClipboardPlus, 
  User, 
  Car, 
  Wrench, 
  DollarSign, 
  Check, 
  Inbox, 
  Clock, 
  AlertCircle,
  FileText,
  CreditCard,
  Truck,
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
  const [filterCriteria, setFilterCriteria] = useState<'all' | 'pending' | 'ready' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Find vehicles for selected client
  const clientVehicles = clients.find(c => c.id === selectedClientId)?.vehicles || [];

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedClientId(val);
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
      showAlert('error', 'Selecciona un cliente de la lista.');
      return;
    }
    if (!selectedVehicleId) {
      showAlert('error', 'Selecciona un vehículo del cliente.');
      return;
    }
    if (!issueDescription.trim()) {
      showAlert('error', 'Describe la falla reportada por el cliente.');
      return;
    }
    if (!assignedMechanicId) {
      showAlert('error', 'Asigna un mecánico para realizar la revisión.');
      return;
    }

    // Map service prices
    const orderServices: OrderService[] = selectedServiceIds.map(id => {
      const match = services.find(s => s.id === id);
      return {
        name: match?.name || 'Servicio General',
        price: match?.basePrice || 0
      };
    });

    // If no services were checked, default to a free basic diagnosis or $0, but let's notify they can add services later too
    if (orderServices.length === 0) {
      orderServices.push({ name: 'Diagnóstico Diagnóstico Inicial', price: 0 });
    }

    const newOrder: Order = {
      id: `OT-${1000 + orders.length + 1}`,
      clientId: selectedClientId,
      vehicleId: selectedVehicleId,
      issue: issueDescription.trim(),
      mechanicId: assignedMechanicId,
      status: 'En revisión',
      paymentStatus: 'Pendiente de pago', // always starts as pending for work order, but let's allow receptionist to pay
      services: orderServices,
      notes: customNotes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    onCreateOrder(newOrder);
    showAlert('success', `¡Orden de Entrada ${newOrder.id} creada con éxito! Se asignó correctamente.`);

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

  // Total order price calculation
  const calculateOrderTotal = (order: Order) => {
    return order.services.reduce((total, s) => total + s.price, 0);
  };

  // Filter existing orders
  const filteredOrders = orders.filter(order => {
    const client = getClientDetails(order.clientId);
    const vehicle = getVehicleDetails(order.clientId, order.vehicleId);
    
    // Search query matches
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Direct filters
    if (filterCriteria === 'pending') {
      return order.paymentStatus === 'Pendiente de pago';
    }
    if (filterCriteria === 'ready') {
      return order.status === 'Listo para entrega';
    }
    if (filterCriteria === 'paid') {
      return order.paymentStatus === 'Pagado';
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="reception-panel">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-4 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'create'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          id="btn-recep-create"
        >
          <ClipboardPlus size={18} />
          1. Crear Orden de Entrada 🛠️
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-4 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'register'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          id="btn-recep-register"
        >
          <DollarSign size={18} />
          2. Registrar Pago y Salida 💰
        </button>
      </div>

      {/* Alert toast */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 text-sm z-30 ${
              alert.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
            }`}
          >
            {alert.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        {activeTab === 'create' ? (
          <form onSubmit={handleSubmitOrder} className="space-y-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold font-display text-slate-900 border-b pb-3 flex items-center gap-2">
              <ClipboardPlus size={22} className="text-indigo-600" />
              Nueva Orden de Entrada de Vehículo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Client & Vehicle selection */}
              <div className="space-y-4">
                {/* Select Client */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex justify-between items-center">
                    <span>Propietario / Cliente *</span>
                    <span className="text-[10px] text-slate-400 capitalize">Debe estar registrado previamente</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClientId}
                      onChange={handleClientChange}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    >
                      <option value="">-- Selecciona el Cliente --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.type === 'empresa' ? '🏢 Empresa' : '👤 Particular'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Select Vehicle */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Vehículo * (Filtrado por cliente)
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    required
                    disabled={!selectedClientId}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {!selectedClientId ? 'Selecciona primero un cliente' : '-- Selecciona un vehículo --'}
                    </option>
                    {clientVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} - [{v.plate}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Mechanic */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Asignar Técnico / Mecánico *
                  </label>
                  <select
                    value={assignedMechanicId}
                    onChange={(e) => setAssignedMechanicId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  >
                    <option value="">-- Selecciona un Mecánico --</option>
                    {mechanics.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} - ({m.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Issue description */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Falla reportada y observaciones *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe detalladamente qué le falla al auto, ruidos reportados, encendido de testigos en tablero, etc."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Pre-select Services */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex justify-between items-center">
                    <span>Servicios del Catálogo a Incluir</span>
                    <span className="text-[10px] text-slate-400">Precios base preestablecidos</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                    Marca las casillas correspondientes al presupuesto inicial. El valor se calculará en la cobranza.
                  </p>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                    {services.map(srv => {
                      const isChecked = selectedServiceIds.includes(srv.id);
                      return (
                        <div
                          key={srv.id}
                          onClick={() => handleToggleService(srv.id)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                            isChecked
                              ? 'bg-indigo-50 text-indigo-900 border-indigo-200 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Sparked by container click
                            className="mt-0.5 rounded-sm border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center gap-1">
                              <span className="text-xs font-bold leading-none">{srv.name}</span>
                              <span className="text-xs font-mono font-bold text-indigo-600 shrink-0">
                                ${srv.basePrice.toLocaleString('es-MX')}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5 max-w-[280px] line-clamp-1">
                              {srv.description}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Notas Internas o de Flotilla</label>
                  <textarea
                    rows={2}
                    placeholder="Instrucciones especiales, si requiere lavado, si es de crédito empresa..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 resize-none animate-none"
                  />
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <div className="flex justify-between items-center text-slate-600 text-xs mb-1">
                    <span>Mano de obra y servicios pre-seleccionados:</span>
                    <span>{selectedServiceIds.length} ítems</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-900 font-bold text-sm">
                    <span>Presupuesto Base:</span>
                    <span className="text-indigo-600 font-mono text-base">
                      ${selectedServiceIds
                        .reduce((sum, id) => sum + (services.find(s => s.id === id)?.basePrice || 0), 0)
                        .toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <ClipboardPlus size={16} />
                Confirmar y Registrar Orden de Entrada
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-1.5">
                  <DollarSign size={20} className="text-emerald-600" />
                  Cobranza y Salida de Vehículos
                </h3>
                <p className="text-xs text-slate-400">Marcar como pagada o realizar la entrega oficial a clientes particulares y corporativos.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterCriteria('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    filterCriteria === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Todas ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCriteria('pending')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    filterCriteria === 'pending'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Pendiente Cobrar ({orders.filter(o => o.paymentStatus === 'Pendiente de pago').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCriteria('ready')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    filterCriteria === 'ready'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Listo para Entrega ({orders.filter(o => o.status === 'Listo para entrega' && o.paymentStatus !== 'Pagado').length})
                </button>
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="relative max-w-sm mb-4">
              <input
                type="text"
                placeholder="Buscar por placa, cliente u orden..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 font-sans"
              />
            </div>

            {/* Orders list for checkout */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl" id="empty-reception-orders">
                  <Inbox size={32} className="mx-auto text-slate-300 mb-2" />
                  No se encontraron órdenes que coincidan con el criterio seleccionado.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const client = getClientDetails(order.clientId);
                  const vehicle = getVehicleDetails(order.clientId, order.vehicleId);
                  const total = calculateOrderTotal(order);

                  return (
                    <div
                      key={order.id}
                      className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col xl:flex-row justify-between gap-6"
                      id={`order-checkout-card-${order.id}`}
                    >
                      {/* Left: Client + Vehicle + Issue details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap justify-between xl:justify-start">
                          <span className="font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-md">
                            {order.id}
                          </span>
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock size={12} />
                            Ingreso: {new Date(order.createdAt).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          {/* Phase badge */}
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            order.status === 'En revisión'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : order.status === 'Reparando'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            🔧 {order.status}
                          </span>

                          {/* Payment badge */}
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            order.paymentStatus === 'Pagado'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          }`}>
                            💵 {order.paymentStatus}
                          </span>
                        </div>

                        {/* Customer & Car grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</p>
                            <p className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                              {client?.type === 'empresa' ? <Truck size={14} className="text-purple-600" /> : <User size={14} className="text-indigo-600" />}
                              {client?.name}
                            </p>
                            <p className="text-xs text-slate-400">Tipo: <span className="capitalize">{client?.type}</span> | Tel: {client?.phone}</p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehículo Asignado</p>
                            <p className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                              <Car size={14} className="text-slate-600" />
                              {vehicle?.brand} {vehicle?.model}
                            </p>
                            <p className="text-xs text-slate-500">
                              Año: {vehicle?.year} | Placas: <strong className="font-mono bg-slate-100 px-1 py-0.5 rounded-sm">{vehicle?.plate}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Reported Fault */}
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <FileText size={12} />
                            Falla Reportada
                          </p>
                          <p className="text-xs text-slate-700 mt-1 italic bg-slate-50 p-2.5 border border-slate-100 rounded-xl leading-relaxed">
                            "{order.issue}"
                          </p>
                        </div>

                        {/* Assigned Tech */}
                        <div className="text-xs text-slate-500">
                          ⚙️ Mecánico: <strong className="text-slate-800">{getMechanicName(order.mechanicId)}</strong>
                        </div>
                      </div>

                      {/* Right: Pricing calculation & Call to Actions */}
                      <div className="xl:w-72 border-r xl:border-r-0 xl:border-l border-slate-100 xl:pl-6 flex flex-col justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Presupuesto / Servicios</p>
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto mb-2 pr-1">
                            {order.services.map((item, id) => (
                              <div key={id} className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 truncate max-w-[150px]">{item.name}</span>
                                <span className="font-mono text-slate-500 shrink-0">${item.price.toLocaleString('es-MX')}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-2 text-slate-800">
                            <span>Monto Total:</span>
                            <span className="text-indigo-600 font-mono text-base">
                              ${total.toLocaleString('es-MX')}
                            </span>
                          </div>
                        </div>

                        {/* Reception Actions */}
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          {/* Case 1: Client has NOT paid yet */}
                          {order.paymentStatus === 'Pendiente de pago' ? (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateOrderPayment(order.id, 'Pagado');
                                showAlert('success', `¡Pago registrado correctamente para la orden ${order.id}!`);
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md"
                            >
                              <CreditCard size={14} />
                              Registrar Pago y Finiquito
                            </button>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-100 font-semibold mb-2">
                              <Check size={14} className="stroke-3" />
                              Liquidador / Pagada con éxito
                            </div>
                          )}

                          {/* Case 2: Order is marked as "Listo para entrega" (completed by Mechanic) but receptionist needs to officially deliver & close it */}
                          {order.status === 'Listo para entrega' && order.paymentStatus === 'Pagado' ? (
                            <button
                              type="button"
                              onClick={() => {
                                onDeliverOrder(order.id);
                                showAlert('success', `¡Vehículo entregado con éxito! Se cerró el caso ${order.id}.`);
                              }}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 hover:shadow-md"
                            >
                              <ArrowRight size={14} />
                              Confirmar Entrega de Auto y Cerrar
                            </button>
                          ) : order.status === 'Listo para entrega' && order.paymentStatus === 'Pendiente de pago' ? (
                            <div className="text-center text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 font-medium">
                              ⚠️ Para cerrar y entregar, primero debe registrar el Pago del cliente.
                            </div>
                          ) : (
                            <div className="text-center text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              🕒 Estado mecánico: {order.status}
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
