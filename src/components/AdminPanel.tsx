import React, { useState } from 'react';
import { Client, ServicePrice, Vehicle } from '../types';
import { 
  Users, 
  Tag, 
  Plus, 
  Building2, 
  User, 
  Car, 
  Trash2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  clients: Client[];
  services: ServicePrice[];
  onAddClient: (client: Client) => void;
  onAddService: (service: ServicePrice) => void;
  onDeleteClient?: (id: string) => void;
  onDeleteService?: (id: string) => void;
}

export default function AdminPanel({
  clients,
  services,
  onAddClient,
  onAddService,
  onDeleteClient,
  onDeleteService
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'services'>('clients');

  // Client form state
  const [clientName, setClientName] = useState('');
  const [clientType, setClientType] = useState<'particular' | 'empresa'>('particular');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  // Client's initial vehicle
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');

  // Service form state
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  // Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleRegisterClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !vehiclePlate.trim() || !vehicleBrand.trim() || !vehicleModel.trim()) {
      showAlert('error', 'Por favor llena los campos obligatorios (Nombre, Placas, Marca y Modelo).');
      return;
    }

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      plate: vehiclePlate.trim().toUpperCase(),
      brand: vehicleBrand.trim(),
      model: vehicleModel.trim(),
      year: vehicleYear.trim() || 'N/A'
    };

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: clientName.trim(),
      type: clientType,
      phone: clientPhone.trim() || 'No provisto',
      email: clientEmail.trim() || 'No provisto',
      vehicles: [newVehicle]
    };

    onAddClient(newClient);
    showAlert('success', 'Cliente registrado correctamente.');

    // Reset fields
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setVehiclePlate('');
    setVehicleBrand('');
    setVehicleModel('');
    setVehicleYear('');
  };

  const handleRegisterService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !servicePrice) {
      showAlert('error', 'Por favor llena los campos del servicio (Nombre y Precio).');
      return;
    }

    const priceNum = parseFloat(servicePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showAlert('error', 'Por favor ingresa un precio válido mayor a 0 pesos.');
      return;
    }

    const newService: ServicePrice = {
      id: `srv-${Date.now()}`,
      name: serviceName.trim(),
      description: serviceDescription.trim() || 'Sin descripción adicional',
      basePrice: priceNum
    };

    onAddService(newService);
    showAlert('success', 'Servicio incorporado al catálogo.');

    // Reset fields
    setServiceName('');
    setServiceDescription('');
    setServicePrice('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="admin-panel">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`flex-1 py-4 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'clients'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          id="btn-subtab-clients"
        >
          <Users size={18} />
          Clientes y Flotillas ({clients.length})
        </button>
        <button
          onClick={() => setActiveSubTab('services')}
          className={`flex-1 py-4 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'services'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          id="btn-subtab-services"
        >
          <Tag size={18} />
          Lista de Precios Fijos ({services.length})
        </button>
      </div>

      {/* Floating alerts */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
              alert.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
            }`}
          >
            {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        {activeSubTab === 'clients' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form for New Client */}
            <div className="lg:col-span-1 border-r border-slate-100 lg:pr-8">
              <h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" />
                Registrar Nuevo Cliente
              </h3>
              <form onSubmit={handleRegisterClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Martínez"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Tipo de Cliente *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setClientType('particular')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                        clientType === 'particular'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User size={14} />
                      Particular
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientType('empresa')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                        clientType === 'empresa'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 size={14} />
                      Empresa / Flotilla
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="555..."
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">E-mail</label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Sub-formulario Auto Inicial */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Car size={14} className="text-indigo-600" />
                    Vehículo Inicial Asociado
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Placas *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. MX-123-A"
                          value={vehiclePlate}
                          onChange={(e) => setVehiclePlate(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Año</label>
                        <input
                          type="text"
                          placeholder="Ej. 2019"
                          value={vehicleYear}
                          onChange={(e) => setVehicleYear(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Marca *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Toyota"
                          value={vehicleBrand}
                          onChange={(e) => setVehicleBrand(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Modelo *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Corolla"
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm mt-4 hover:shadow-md"
                >
                  <Plus size={16} />
                  Registrar Cliente y Auto
                </button>
              </form>
            </div>

            {/* List of Clients */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center justify-between">
                <span>Lista y Catalogo de Clientes ({clients.length})</span>
                <span className="text-xs text-slate-400 font-normal">Vehículos registrados</span>
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {clients.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl" id="empty-clients">
                    No hay clientes registrados en la base de datos de flotillas.
                  </div>
                ) : (
                  clients.map((client) => (
                    <div
                      key={client.id}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      id={`client-card-${client.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-base">{client.name}</h4>
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            client.type === 'empresa'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}>
                            {client.type === 'empresa' ? (
                              <>
                                <Building2 size={10} />
                                Empresa / Flotilla
                              </>
                            ) : (
                              <>
                                <User size={10} />
                                Particular
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span><strong>Tel:</strong> {client.phone}</span>
                          <span><strong>Email:</strong> {client.email}</span>
                        </div>

                        {/* Vehicles of client */}
                        <div className="pt-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vehículos Registrados:</p>
                          <div className="flex flex-wrap gap-2">
                            {client.vehicles.map((v) => (
                              <div
                                key={v.id}
                                className="inline-flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-xs text-slate-700"
                              >
                                <Car size={12} className="text-slate-500" />
                                <span>{v.brand} <strong>{v.model}</strong> ({v.year})</span>
                                <span className="font-mono bg-slate-200/80 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm select-all">
                                  {v.plate}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {onDeleteClient && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas eliminar a ${client.name}?`)) {
                              onDeleteClient(client.id);
                              showAlert('success', 'Cliente eliminado de la base de datos.');
                            }
                          }}
                          className="self-end sm:self-start p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Eliminar cliente"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form for New Service */}
            <div className="lg:col-span-1 border-r border-slate-100 lg:pr-8">
              <h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" />
                Agregar Servicio Fijo
              </h3>
              <form onSubmit={handleRegisterService} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nombre del Servicio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Diagnóstico Computarizado"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Precio Base (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono text-sm">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="850"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Descripción Breve</label>
                  <textarea
                    rows={3}
                    placeholder="Describe brevemente qué incluye este servicio para el mecánico..."
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
                >
                  <Plus size={16} />
                  Guardar Servicio Base
                </button>
              </form>
            </div>

            {/* List of services catalog */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center justify-between">
                <span>Catálogo de Servicios Fijos ({services.length})</span>
                <span className="text-xs text-slate-400 font-normal">Precios fijos sin variación</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between"
                    id={`service-card-${service.id}`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{service.name}</h4>
                        <span className="font-mono font-bold text-indigo-600 text-sm shrink-0">
                          ${service.basePrice.toLocaleString('es-MX')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4">{service.description}</p>
                    </div>

                    {onDeleteService && (
                      <div className="flex justify-end pt-2 border-t border-slate-50">
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas eliminar el servicio ${service.name}?`)) {
                              onDeleteService(service.id);
                              showAlert('success', 'Servicio eliminado del catálogo.');
                            }
                          }}
                          className="p-1 px-2.5 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex items-center gap-1"
                          title="Eliminar de la lista"
                        >
                          <Trash2 size={12} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
