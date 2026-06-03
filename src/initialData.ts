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
  },
  {
    id: 'cli-4',
    name: 'Constructora del Norte S.A.',
    type: 'empresa',
    phone: '81-1234-8899',
    email: 'contacto@constructoranorte.mx',
    vehicles: [
      {
        id: 'veh-5',
        plate: 'CN-123-XY',
        brand: 'Chevrolet',
        model: 'Silverado 3500',
        year: '2022'
      }
    ]
  },
  {
    id: 'cli-5',
    name: 'Dra. Gabriela Escalante',
    type: 'particular',
    phone: '555-7890-4321',
    email: 'gaby.escalante@medicos.com.mx',
    vehicles: [
      {
        id: 'veh-6',
        plate: 'DR-711-GE',
        brand: 'Honda',
        model: 'CR-V',
        year: '2023'
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
  },
  {
    id: 'OT-1004',
    clientId: 'cli-4',
    vehicleId: 'veh-5',
    issue: 'Revisión de suspensión trasera por exceso de ruido al cargar material pesado en caja.',
    mechanicId: 'mec-3',
    status: 'En revisión',
    paymentStatus: 'Pendiente de pago',
    services: [
      { name: 'Diagnóstico Computarizado', price: 600 }
    ],
    notes: 'Cargamento de materiales de obra habitual. Prioridad alta por logística de constructora.',
    createdAt: '2026-06-03T11:45:00Z'
  },
  {
    id: 'OT-1000',
    clientId: 'cli-5',
    vehicleId: 'veh-6',
    issue: 'El aire acondicionado no enfría adecuadamente y arroja un olor a humedad al encenderse.',
    mechanicId: 'mec-2',
    status: 'Listo para entrega',
    paymentStatus: 'Pagado',
    services: [
      { name: 'Diagnóstico Computarizado', price: 600 },
      { name: 'Cambio de Aceite y Filtro', price: 850 }
    ],
    notes: 'Recarga de gas refrigerante realizada y desinfección preventiva de ductos terminada.',
    createdAt: '2026-06-01T09:00:00Z',
    completedAt: '2026-06-02T16:15:00Z',
    isDelivered: true
  } as any,
  {
    id: 'OT-0999',
    clientId: 'cli-1',
    vehicleId: 'veh-1',
    issue: 'Cambio de balatas delanteras y rectificado de discos porque rechinan al frenar en pendientes.',
    mechanicId: 'mec-3',
    status: 'Listo para entrega',
    paymentStatus: 'Pagado',
    services: [
      { name: 'Mantenimiento de Frenos', price: 1800 }
    ],
    notes: 'Sustitución de balatas cerámicas y rectificado completo. El dueño recogió el auto de conformidad.',
    createdAt: '2026-05-28T08:30:00Z',
    completedAt: '2026-05-28T14:40:00Z',
    isDelivered: true
  } as any,
  {
    id: 'OT-0998',
    clientId: 'cli-2',
    vehicleId: 'veh-2',
    issue: 'Mantenimiento preventivo periódico por kilometraje cumplido (Aceite sintético de motor 5W30).',
    mechanicId: 'mec-1',
    status: 'Listo para entrega',
    paymentStatus: 'Pagado',
    services: [
      { name: 'Cambio de Aceite y Filtro', price: 850 }
    ],
    notes: 'Registro de kilometraje ingresado en bitácora de flotilla corporativa de Flecha S.A.',
    createdAt: '2026-05-25T10:00:00Z',
    completedAt: '2026-05-25T13:20:00Z',
    isDelivered: true
  } as any
];
