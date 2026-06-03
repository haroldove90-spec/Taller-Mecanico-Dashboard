import { Client, ServicePrice, Mechanic, Order } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Juan Carlos Pérez',
    type: 'particular',
    phone: '555-1234-567',
    email: 'juancarlos@gmail.com',
    vehicles: [
      {
        id: 'veh-1',
        plate: 'MX-456-AB',
        brand: 'Toyota',
        model: 'Corolla',
        year: '2019'
      }
    ]
  },
  {
    id: 'cli-2',
    name: 'Logística Flecha S.A.',
    type: 'empresa',
    phone: '555-9876-000',
    email: 'contacto@flechasa.com',
    vehicles: [
      {
        id: 'veh-2',
        plate: 'FL-889-TR',
        brand: 'Ford',
        model: 'F-150 (Flotilla)',
        year: '2021'
      },
      {
        id: 'veh-3',
        plate: 'FL-890-TR',
        brand: 'Nissan',
        model: 'NP300',
        year: '2020'
      }
    ]
  },
  {
    id: 'cli-3',
    name: 'Mónica Alejandra Silva',
    type: 'particular',
    phone: '555-4567-890',
    email: 'moni.silva@outlook.com',
    vehicles: [
      {
        id: 'veh-4',
        plate: 'CD-789-KL',
        brand: 'Mazda',
        model: 'Mazda 3',
        year: '2018'
      }
    ]
  }
];

export const INITIAL_SERVICES: ServicePrice[] = [
  {
    id: 'srv-1',
    name: 'Alineación y Balanceo',
    description: 'Alineación de 4 ruedas y balanceo computarizado.',
    basePrice: 1200
  },
  {
    id: 'srv-2',
    name: 'Cambio de Aceite y Filtro',
    description: 'Aceite sintético de alta calidad y filtro nuevo.',
    basePrice: 850
  },
  {
    id: 'srv-3',
    name: 'Diagnóstico Computarizado',
    description: 'Escaneo de códigos OBD-II e inspección visual de sensores.',
    basePrice: 600
  },
  {
    id: 'srv-4',
    name: 'Mantenimiento de Frenos',
    description: 'Cambio de balatas delanteras y rectificado de discos.',
    basePrice: 1800
  },
  {
    id: 'srv-5',
    name: 'Afinación Mayor',
    description: 'Limpieza de inyectores, cambio de bujías, filtros de aire y gasolina.',
    basePrice: 2400
  }
];

export const INITIAL_MECHANICS: Mechanic[] = [
  {
    id: 'mec-1',
    name: 'Eduardo "Lalo" Mendoza',
    specialty: 'Afinaciones y Motores'
  },
  {
    id: 'mec-2',
    name: 'Ing. Francisco Javier',
    specialty: 'Sistemas Eléctricos y Diagnóstico'
  },
  {
    id: 'mec-3',
    name: 'Don Chema Torres',
    specialty: 'Frenos, Suspensión y Dirección'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'OT-1001',
    clientId: 'cli-1',
    vehicleId: 'veh-1',
    issue: 'Hace un cascabelero metálico al acelerar y el pedal del acelerador oscila brevemente.',
    mechanicId: 'mec-1',
    status: 'En revisión',
    paymentStatus: 'Pendiente de pago',
    services: [
      { name: 'Diagnóstico Computarizado', price: 600 }
    ],
    notes: 'Cliente de confianza. Entregar de preferencia por la tarde.',
    createdAt: '2026-06-03T09:30:00Z'
  },
  {
    id: 'OT-1002',
    clientId: 'cli-2',
    vehicleId: 'veh-3',
    issue: 'Falta potencia en pendientes y el testigo de Check Engine parpadea de forma intermitente.',
    mechanicId: 'mec-2',
    status: 'Reparando',
    paymentStatus: 'Pendiente de pago',
    services: [
      { name: 'Afinación Mayor', price: 2400 },
      { name: 'Diagnóstico Computarizado', price: 600 }
    ],
    notes: 'Vehículo comercial indispensable para operación. Autorizado directamente por Gerente de Operaciones de Flecha S.A.',
    createdAt: '2026-06-03T10:15:00Z'
  },
  {
    id: 'OT-1003',
    clientId: 'cli-3',
    vehicleId: 'veh-4',
    issue: 'Revisión general de seguridad para viaje y alineación de volante que está cargado hacia la izquierda.',
    mechanicId: 'mec-3',
    status: 'Listo para entrega',
    paymentStatus: 'Pagado',
    services: [
      { name: 'Alineación y Balanceo', price: 1200 },
      { name: 'Cambio de Aceite y Filtro', price: 850 }
    ],
    notes: 'Pago liquidado con tarjeta de débito en terminal. Trabajo terminado satisfactoriamente.',
    createdAt: '2026-06-02T14:00:00Z',
    completedAt: '2026-06-03T11:00:00Z'
  }
];
