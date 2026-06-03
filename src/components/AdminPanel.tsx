import React, { useState } from 'react';
import { Client, ServicePrice, Vehicle } from '../types';
import { 
  Users, 
  Tag, 
  Plus, 
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
      showAlert('error', 'Llena los campos obligatorios (Nombre, Placas, Marca y Modelo).');
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
      showAlert('error', 'Llena los campos obligatorios del servicio (Nombre y Precio).');
      return;
    }

    const priceNum = parseFloat(servicePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showAlert('error', 'Ingresa un precio válido mayor a 0 pesos.');
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden" id="admin-panel">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-150">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`flex-1 py-4 text-center text-sm md:text-base font-bold flex items-center justify-center gap-2.5 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'clients'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="btn-subtab-clients"
        >
          <Users size={18} />
          Clientes y Flotillas
        </button>
        <button
          onClick={() => setActiveSubTab('services')}
          className={`flex-1 py-4 text-center text-sm md:text-base font-bold flex items-center justify-center gap-2.5 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'services'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="btn-subtab-services"
        >
          <Tag size={18} />
          Lista de Precios Fijos
        </button>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mx-5 mt-4 p-3 rounded-lg flex items-center gap-2.5 text-sm font-semibold ${
              alert.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100/50 shadow-xs' 
                : 'bg-rose-50 text-rose-800 border border-rose-100/50 shadow-xs'
            }`}
          >
            {alert.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        {activeSubTab === 'clients' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form */}
            <form onSubmit={handleRegisterClient} className="lg:col-span-4 space-y-4 pr-0 lg:pr-5 lg:border-r lg:border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nuevo Registro</span>
              
              <div>
                <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Martínez"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-950 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Tipo de Cliente *</label>
                <div className="grid grid-cols-2 gap-1 px-0.5">
                  <button
                    type="button"
                    onClick={() => setClientType('particular')}
                    className={`py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                      clientType === 'particular'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Particular
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('empresa')}
                    className={`py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                      clientType === 'empresa'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Empresa / Flotilla
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="555..."
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="carlos@..."
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Subform vehicle */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Vehículo</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Placas *</label>
                    <input
                      type="text"
                      required
                      placeholder="MEX-12"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Año</label>
                    <input
                      type="text"
                      placeholder="2019"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Marca *</label>
                    <input
                      type="text"
                      required
                      placeholder="Audi"
                      value={vehicleBrand}
                      onChange={(e) => setVehicleBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Modelo *</label>
                    <input
                      type="text"
                      required
                      placeholder="A4"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus size={15} />
                Registrar Cliente
              </button>
            </form>

            {/* List */}
            <div className="lg:col-span-8 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Catálogo de Clientes ({clients.length})</span>
              
              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                {clients.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-lg text-sm" id="empty-clients">
                    No hay clientes registrados de momento.
                  </div>
                ) : (
                  clients.map((client) => (
                    <div
                      key={client.id}
                      className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-start justify-between gap-4 shadow-3xs"
                      id={`client-card-${client.id}`}
                    >
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="font-bold text-slate-800 text-sm md:text-base">{client.name}</h4>
                          <span className="text-xs text-slate-450 hover:text-slate-650 uppercase font-mono tracking-wider font-semibold">
                            ({client.type})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 leading-none">
                          <span>Tel: <strong className="text-slate-750">{client.phone}</strong></span>
                          <span>&bull;</span>
                          <span>Email: <strong className="text-slate-750">{client.email}</strong></span>
                        </div>

                        {/* Vehicles */}
                        <div className="pt-2 flex flex-wrap gap-2">
                          {client.vehicles.map((v) => (
                            <div
                              key={v.id}
                              className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 shadow-3xs hover:border-slate-300 transition-all"
                            >
                              <span className="font-medium">{v.brand} {v.model} ({v.year})</span>
                              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md select-all border border-slate-200/50">
                                {v.plate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {onDeleteClient && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas eliminar a ${client.name}?`)) {
                              onDeleteClient(client.id);
                              showAlert('success', 'Cliente eliminado con éxito.');
                            }
                          }}
                          className="p-1.5 text-slate-350 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0 cursor-pointer"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form */}
            <form onSubmit={handleRegisterService} className="lg:col-span-4 space-y-4 pr-0 lg:pr-5 lg:border-r lg:border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nuevo Servicio Fijo</span>
              
              <div>
                <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cambio de Aceite"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Precio Base (MXN) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-450 text-sm">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="850"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-slate-600 font-semibold mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  placeholder="Incluye cambio de filtro, etc."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus size={15} />
                Guardar Servicio
              </button>
            </form>

            {/* List */}
            <div className="lg:col-span-8 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Catálogo del Taller ({services.length})</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto max-h-[500px] pr-1">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all flex flex-col justify-between text-sm shadow-3xs"
                    id={`service-card-${service.id}`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1.5">
                        <h4 className="font-bold text-slate-800 leading-tight text-sm md:text-base">{service.name}</h4>
                        <span className="font-mono font-bold text-slate-900 shrink-0 select-all">
                          ${service.basePrice.toLocaleString('es-MX')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{service.description}</p>
                    </div>

                    {onDeleteService && (
                      <div className="flex justify-end pt-3 border-t border-slate-200/50 mt-3">
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas eliminar el servicio ${service.name}?`)) {
                              onDeleteService(service.id);
                              showAlert('success', 'Servicio eliminado.');
                            }
                          }}
                          className="text-xs text-slate-400 hover:text-rose-600 transition-all py-1 px-2.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          Eliminar
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
