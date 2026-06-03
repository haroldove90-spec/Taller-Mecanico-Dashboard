import { Order } from '../types';
import { 
  ClipboardList, 
  Wrench, 
  CheckCircle2, 
  DollarSign, 
  Car 
} from 'lucide-react';
import { motion } from 'motion/react';

interface StatsOverviewProps {
  orders: Order[];
}

export default function StatsOverview({ orders }: StatsOverviewProps) {
  // Active orders (not delivered or just everything that is active in current list)
  const activeOrders = orders.filter(o => o.status !== 'Listo para entrega' || o.paymentStatus !== 'Pagado');
  const enRevision = orders.filter(o => o.status === 'En revisión').length;
  const reparando = orders.filter(o => o.status === 'Reparando').length;
  const listoParaEntrega = orders.filter(o => o.status === 'Listo para entrega' && o.paymentStatus !== 'Pagado').length;

  // Total collected (Pagado)
  const totalCollected = orders
    .filter(o => o.paymentStatus === 'Pagado')
    .reduce((sum, o) => {
      const orderTotal = o.services.reduce((sSum, s) => sSum + s.price, 0);
      return sum + orderTotal;
    }, 0);

  // Total pending (Pendiente de pago)
  const totalPending = orders
    .filter(o => o.paymentStatus === 'Pendiente de pago')
    .reduce((sum, o) => {
      const orderTotal = o.services.reduce((sSum, s) => sSum + s.price, 0);
      return sum + orderTotal;
    }, 0);

  const stats = [
    {
      id: 'stat-active',
      title: 'Órdenes Activas',
      value: activeOrders.length,
      description: 'En proceso de atención',
      icon: ClipboardList,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      id: 'stat-revision',
      title: 'En Revisión',
      value: enRevision,
      description: 'Por diagnosticar',
      icon: Car,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      id: 'stat-reparando',
      title: 'En Reparación',
      value: reparando,
      description: 'Técnicos trabajando',
      icon: Wrench,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'stat-listo',
      title: 'Listo para Entrega',
      value: listoParaEntrega,
      description: 'Por cobrar y entregar',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      id: 'stat-caja',
      title: 'Ingresos Cobrados',
      value: `$${totalCollected.toLocaleString('es-MX')}`,
      description: `Pendiente: $${totalPending.toLocaleString('es-MX')}`,
      icon: DollarSign,
      color: 'text-slate-800 bg-slate-100 border-slate-200',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`border rounded-xl p-4 bg-white shadow-xs flex items-center justify-between`}
            id={stat.id}
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold font-display mt-1 text-slate-900">{stat.value}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-xl border ${stat.color}`}>
              <Icon size={20} className="stroke-2" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
