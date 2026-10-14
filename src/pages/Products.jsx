import { useMemo, useState } from 'react';
import { PackageOpen, Search } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import ProductForm from '../components/products/ProductForm';
import ProductCard from '../components/products/ProductCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function Products({ onNavigate }) {
  const { products, loading, removeProduct } = useInventory();
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('todos');

  const units = products.reduce((s, p) => s + p.stock, 0);
  const capacity = Math.min(100, Math.round((units / 1500) * 1000) / 10);

  const list = useMemo(() => products.filter((p) => {
    const t = `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase());
    const f = filter === 'todos' || (filter === 'agotado' && p.stock === 0) || (filter === 'bajo' && p.stock > 0 && p.stock <= 10) || (filter === 'alto' && p.stock > 10);
    return t && f;
  }), [products, q, filter]);

  const edit = (p) => { setEditing(p); document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const confirmDelete = async () => {
    setBusy(true);
    try { await removeProduct(toDelete.id); if (editing?.id === toDelete.id) setEditing(null); setToDelete(null); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Registro y gestión de productos</h1>
          <p className="mt-1 text-sm text-slate-500">Completa la ficha técnica para ingresar nuevas existencias a bodega o gestiona el catálogo activo en tiempo real.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="card px-4 py-2 text-right"><p className="text-[10px] text-slate-400">Catálogo activo</p><p className="text-sm font-extrabold text-emerald-700">{products.length} SKU registrados</p></div>
          <button className="btn-primary" onClick={() => onNavigate('movimientos')}>Siguiente: registro de movimientos</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><ProductForm editing={editing} onDone={() => setEditing(null)} /></div>
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-[11px] font-bold text-slate-500">Capacidad de bodega A-01</p>
            <p className="mt-2 text-4xl font-extrabold text-brand-800">{capacity}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700" style={{ width: `${capacity}%` }} /></div>
            <p className="mt-2 text-[11px] text-slate-400">{units.toLocaleString('es-MX')} unidades almacenadas</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 p-5 text-white">
            <h3 className="font-extrabold">Recepción y control de calidad</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/70">Inspecciona las herramientas antes de registrarlas: un SKU bien descrito evita errores en despacho.</p>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-extrabold">Productos registrados</h2><p className="text-xs text-slate-400">{list.length} de {products.length} productos</p></div>
          <div className="flex gap-2">
            <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="field !w-56 !bg-white !pl-9" placeholder="Buscar por nombre o SKU…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <select className="field !w-36 !bg-white" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por stock">
              <option value="todos">Todos</option><option value="alto">Stock alto</option><option value="bajo">Stock bajo</option><option value="agotado">Agotados</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="card h-52 animate-pulse bg-slate-100" />)}</div>
        ) : list.length === 0 ? (
          <div className="card grid place-items-center gap-2 py-14 text-center text-slate-400"><PackageOpen size={34} /><p className="text-sm font-semibold text-slate-600">No hay productos que coincidan</p><p className="text-xs">Ajusta la búsqueda o registra un producto nuevo.</p></div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} active={editing?.id === p.id} onEdit={edit} onDelete={setToDelete} />)}</div>
        )}
      </section>

      <ConfirmDialog open={!!toDelete} busy={busy} title="¿Eliminar producto?" text={`Se eliminará "${toDelete?.name}" (${toDelete?.sku}) del catálogo. Esta acción no se puede deshacer.`} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  );
}
