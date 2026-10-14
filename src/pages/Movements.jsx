import { Banknote, Clock, ListChecks } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { money, today } from '../utils/format';
import StatCard from '../components/ui/StatCard';
import ExitForm from '../components/movements/ExitForm';
import MovementsTable from '../components/movements/MovementsTable';

export default function Movements() {
  const { movements } = useInventory();
  const dispatched = movements.reduce((s, m) => s + m.qty * m.price, 0);
  const todayOps = movements.filter((m) => m.date === today()).length;
  return (
    <div className="space-y-6">
      <div><p className="text-xs font-semibold text-slate-400">Control de flujo</p><h1 className="text-3xl font-extrabold tracking-tight">Registro de movimientos y salidas de inventario</h1></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total movimientos" value={movements.length.toLocaleString('es-MX')} icon={ListChecks} tone="slate" note="Salidas registradas" />
        <StatCard label="Valor despachado" value={money(dispatched)} icon={Banknote} tone="emerald" note="Suma de todas las salidas" />
        <StatCard label="Operaciones de hoy" value={todayOps} icon={Clock} tone="sky" note="Turno en curso" />
      </div>
      <ExitForm />
      <MovementsTable />
    </div>
  );
}
