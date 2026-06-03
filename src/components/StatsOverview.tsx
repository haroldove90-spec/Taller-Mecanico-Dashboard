import { Order } from '../types';
import { motion } from 'motion/react';

interface StatsOverviewProps {
  orders: Order[];
}

export default function StatsOverview({ orders }: StatsOverviewProps) {
  const activeOrders = orders.filter(o => o.status !== 'Listo para entrega' || o.paymentStatus !== 'Pagado').length;
  const enRevision = orders.filter(o => o.status === 'En revisión').length;
  const reparando = orders.filter(o => o.status === 'Reparando').length;
  const listos = orders.filter(o => o.status === 'Listo para entrega' && o.paymentStatus !== 'Pagado').length;
  
  const totalCollected = orders
    .filter(o => o.paymentStatus === 'Pagado')
    .reduce((sum, o) => sum + o.services.reduce((sSum, s) => sSum + s.price, 0), 0);

  const stats = [
    { label: 'Órdenes Activas', value: activeOrders },
    { label: 'Revisión / Diagnóstico', value: enRevision },
    { label: 'En Reparación', value: reparando },
    { label: 'Listos para Entrega', value: listos },
    { label: 'Caja Cobrada (MXN)', value: `$${totalCollected.toLocaleString('es-MX')}` }
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-3 px-6 bg-white border border-slate-200/60 rounded-xl mb-6 shadow-2xs" id="stats-overview">
      {stats.map((stat, i) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-baseline gap-2 flex-wrap sm:flex-nowrap"
        >
          <span className="text-sm text-slate-500 font-medium">{stat.label}:</span>
          <span className="text-base md:text-lg font-bold text-slate-900 font-mono">{stat.value}</span>
          {i < stats.length - 1 && <span className="text-slate-200 ml-4 hidden sm:inline">|</span>}
        </motion.div>
      ))}
    </div>
  );
}
