import { useState } from 'react';
import { Download, Search, Trash2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { downloadCSV, money } from '../../utils/format';
import ConfirmDialog from '../ui/ConfirmDialog';

export default function MovementsTable() {
  const { movements, removeMovement } = useInventory();
  const [q, setQ] = useState('');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const rows = movements.filter((m) => `${m.code} ${m.productName} ${m.sku}`.toLowerCase().includes(q.toLowerCase()));

  const exportCsv = () => downloadCSV([['ID', 'SKU', 'Producto', 'Cantidad', 'Precio', 'Total', 'Fecha', 'Hora'], ...rows.map((m) => [m.code, m.sku, m.productName, m.qty, m.price, m.qty * m.price, m.date, m.time])], 'movimientos.csv');
  const confirm = async () => { setBusy(true); try { await removeMovement(target.id); setTarget(null); } finally { setBusy(false); } };

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div><h2 className="font-extrabold">Historial de movimientos registrados <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">{rows.length} registros</span></h2><p className="text-xs text-slate-400">Anular una salida devuelve las unidades al stock.</p></div>
        <div className="flex gap-2">
          <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field !w-52 !bg-white !pl-9" placeholder="Buscar por ID o producto…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <button className="btn-ghost" onClick={exportCsv} disabled={!rows.length}><Download size={15} />Exportar</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500"><tr>{['ID', 'Producto', 'Cant.', 'Precio', 'Total', 'Fecha', ''].map((h, i) => <th key={i} className="px-5 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3.5"><span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500">{m.code}</span></td>
                <td className="px-5 py-3.5"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" /><span className="font-semibold">{m.productName}</span></td>
                <td className="px-5 py-3.5 font-semibold">{m.qty}</td>
                <td className="px-5 py-3.5 text-slate-500">{money(m.price)}</td>
                <td className="px-5 py-3.5 font-extrabold">{money(m.qty * m.price)}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{m.date} · {m.time}</td>
                <td className="px-5 py-3.5 text-right"><button className="btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => setTarget(m)}><Trash2 size={13} />Anular</button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">Aún no hay salidas. Registra la primera con el formulario superior.</td></tr>}
          </tbody>
        </table>
      </div>
      <ConfirmDialog open={!!target} busy={busy} confirmLabel="Anular salida" title="¿Anular esta salida?" text={`Se eliminará ${target?.code} y se devolverán ${target?.qty} uds. de "${target?.productName}" al stock.`} onCancel={() => setTarget(null)} onConfirm={confirm} />
    </section>
  );
}
