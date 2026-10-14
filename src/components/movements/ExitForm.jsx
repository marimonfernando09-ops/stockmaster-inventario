import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { money, nowTime, today } from '../../utils/format';

const init = () => ({ productId: '', qty: '1', price: '', date: today(), time: nowTime() });

export default function ExitForm() {
  const { products, addMovement } = useInventory();
  const [f, setF] = useState(init);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const sel = products.find((p) => p.id === f.productId);
  const total = (Number(f.qty) || 0) * (Number(f.price) || 0);

  const pick = (e) => { const p = products.find((x) => x.id === e.target.value); setF((s) => ({ ...s, productId: e.target.value, price: p ? String(p.price) : '' })); };
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    const qty = Number(f.qty);
    if (!sel) return setError('Selecciona un producto de la lista.');
    if (!Number.isInteger(qty) || qty < 1) return setError('La cantidad debe ser un entero de 1 o más.');
    if (qty > sel.stock) return setError(`Solo hay ${sel.stock} uds. disponibles de este producto.`);
    if (!(Number(f.price) > 0)) return setError('Ingresa un precio unitario válido.');
    setBusy(true);
    try { await addMovement({ productId: sel.id, qty, price: Number(f.price), date: f.date, time: f.time }); setF(init()); } catch (er) { setError(er.message); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card animate-pop p-6" noValidate>
      <h2 className="font-extrabold">Formulario de salida</h2>
      <p className="mb-5 text-xs text-slate-400">Captura los parámetros exactos para generar un nuevo registro auditado.</p>
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="prod">1. Nombre del producto</label>
          <select id="prod" className="field" value={f.productId} onChange={pick}>
            <option value="">Selecciona un producto del catálogo…</option>
            {products.map((p) => <option key={p.id} value={p.id} disabled={p.stock === 0}>{p.name} · {p.stock === 0 ? 'Agotado' : `${p.stock} uds.`}</option>)}
          </select>
          <p className="hint">Vinculado al inventario: se descuenta del stock disponible.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div><label className="label" htmlFor="qty">2. Cantidad</label><input id="qty" type="number" min="1" max={sel?.stock} className="field" value={f.qty} onChange={set('qty')} /></div>
          <div><label className="label" htmlFor="pr">3. Precio unit. (MXN)</label><input id="pr" type="number" step="0.01" min="0" className="field" value={f.price} onChange={set('price')} placeholder="0.00" /></div>
          <div><label className="label" htmlFor="dt">4. Fecha</label><input id="dt" type="date" className="field" value={f.date} onChange={set('date')} /></div>
          <div><label className="label" htmlFor="tm">5. Hora</label><input id="tm" type="time" className="field" value={f.time} onChange={set('time')} /></div>
        </div>
        {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{error}</p>}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div><p className="flex items-center gap-1.5 text-[11px] text-slate-400"><ShieldCheck size={13} />Auditoría habilitada</p><p className="text-sm font-extrabold">Total de la salida: <span className="text-emerald-700">{money(total)}</span></p></div>
        <div className="flex gap-2"><button type="button" className="btn-ghost" onClick={() => { setF(init()); setError(''); }}>Limpiar</button><button className="btn-primary" disabled={busy}>{busy ? 'Registrando…' : 'Registrar datos'}</button></div>
      </div>
    </form>
  );
}
