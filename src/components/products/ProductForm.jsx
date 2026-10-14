import { useEffect, useState } from 'react';
import { PackagePlus, Pencil, Save, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const EMPTY = { name: '', description: '', price: '', stock: '' };

export default function ProductForm({ editing, onDone }) {
  const { addProduct, updateProduct } = useInventory();
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setF(editing ? { name: editing.name, description: editing.description, price: String(editing.price), stock: String(editing.stock) } : EMPTY);
    setErrors({});
  }, [editing]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const cls = (k) => `field ${errors[k] ? 'field-error' : ''}`;

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = 'Escribe al menos 3 caracteres';
    if (!(Number(f.price) > 0)) er.price = 'El precio debe ser mayor a 0';
    if (f.stock === '' || !Number.isInteger(Number(f.stock)) || Number(f.stock) < 0) er.stock = 'Ingresa un número entero (0 o más)';
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      const data = { name: f.name.trim(), description: f.description.trim(), price: Number(f.price), stock: Number(f.stock) };
      if (editing) await updateProduct(editing.id, data); else await addProduct(data);
      setF(EMPTY); onDone?.();
    } catch { /* el error ya se notifica con un toast */ } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card animate-pop p-6" noValidate id="product-form">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">{editing ? <Pencil size={19} /> : <PackagePlus size={19} />}</div>
        <div className="flex-1">
          <h2 className="font-extrabold">{editing ? `Editando ${editing.sku}` : 'Ingreso de nuevo producto'}</h2>
          <p className="text-xs text-slate-400">{editing ? 'Modifica los datos y guarda los cambios' : 'Todos los campos con asterisco son obligatorios'}</p>
        </div>
        {editing && <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-600">Modo edición</span>}
      </div>
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Nombre del producto *</label>
          <input id="name" className={cls('name')} value={f.name} onChange={set('name')} placeholder="Ej. Taladro Percutor Industrial 750W" />
          {errors.name && <p className="err">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="desc">Descripción</label>
          <textarea id="desc" rows={3} className={`${cls('description')} resize-none`} value={f.description} onChange={set('description')} placeholder="Describe el producto, modelo, garantía o características físicas clave…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="price">Precio unitario *</label>
            <div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input id="price" type="number" step="0.01" min="0" className={`${cls('price')} !pl-8`} value={f.price} onChange={set('price')} placeholder="149.99" /></div>
            {errors.price && <p className="err">{errors.price}</p>}
          </div>
          <div>
            <label className="label" htmlFor="stock">Stock inicial *</label>
            <div className="relative">
              <input id="stock" type="number" min="0" step="1" className={cls('stock')} value={f.stock} onChange={set('stock')} placeholder="45" />
              <span className="absolute right-9 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">uds</span></div>
            {errors.stock && <p className="err">{errors.stock}</p>}
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-[11px] text-slate-400">El código SKU se genera automáticamente</p>
        <div className="flex gap-2">
          {editing && <button type="button" className="btn-ghost" onClick={onDone}><X size={16} />Cancelar</button>}
          <button className="btn-primary" disabled={busy}><Save size={16} />{busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Registrar producto'}</button>
        </div>
      </div>
    </form>
  );
}
