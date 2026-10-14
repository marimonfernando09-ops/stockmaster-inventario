import { AlertTriangle, Banknote, Boxes, PackageCheck } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { money, stockStatus } from '../utils/format';
import StatCard from '../components/ui/StatCard';

export default function Dashboard({ onNavigate }) {
  const { products } = useInventory();
  const value = products.reduce((s, p) => s + p.price * p.stock, 0);
  const low = products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Panel principal</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Productos (SKU)" value={products.length} icon={Boxes} tone="slate" />
        <StatCard label="Unidades en bodega" value={products.reduce((s, p) => s + p.stock, 0).toLocaleString('es-MX')} icon={PackageCheck} />
        <StatCard label="Valor del inventario" value={money(value)} icon={Banknote} tone="sky" />
        <StatCard label="Alertas de stock" value={low.length} icon={AlertTriangle} tone="amber" />
      </div>
      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-extrabold">Requieren reposición</h2><button className="btn-ghost text-xs" onClick={() => onNavigate('productos')}>Gestionar productos</button></div>
        {low.length === 0 ? <p className="py-6 text-center text-sm text-slate-400">Todo el catálogo tiene stock saludable.</p> : (
          <ul className="divide-y divide-slate-100">{low.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3"><div><p className="text-sm font-bold">{p.name}</p><p className="font-mono text-[11px] text-slate-400">{p.sku}</p></div>
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${stockStatus(p.stock).cls}`}>{p.stock} uds. · {stockStatus(p.stock).label}</span></li>))}</ul>)}
      </section>
    </div>
  );
}
