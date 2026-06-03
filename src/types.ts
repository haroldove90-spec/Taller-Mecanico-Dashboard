export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: string;
}

export type ClientType = 'particular' | 'empresa';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  phone: string;
  email: string;
  vehicles: Vehicle[];
}

export interface ServicePrice {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export interface Mechanic {
  id: string;
  name: string;
  specialty: string;
}

export type OrderStatus = 'En revisión' | 'Reparando' | 'Listo para entrega';
export type PaymentStatus = 'Pendiente de pago' | 'Pagado';

export interface OrderService {
  name: string;
  price: number;
}

export interface Order {
  id: string; // e.g. "ORD-1001"
  clientId: string;
  vehicleId: string;
  issue: string; // Falla reportada
  mechanicId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  services: OrderService[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
}
