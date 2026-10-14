import { Box, Pencil, Trash2 } from 'lucide-react';
import { money, stockStatus } from '../../utils/format';
export default function ProductCard({ p, onEdit, onDelete, active }) {
  const st = stockStatus(p.stock);
  return (
    <article className={`card flex animate-pop flex-col overflow-hidden transition ${active ? 'ring-2 ring-emerald-500' : 'hover:shadow-md'}`}>
      <div className="flex items-center justify-between px-4 pt-3.5">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-500">{p.sku}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>{st.label}</span>
      </div>
      <div className="flex gap-3 p-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-800 to-emerald-600 text-white"><Box size={26} /></div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold" title={p.name}>{p.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.description || 'Sin descripción'}</p>
        </div>
      </div>
      <div className="mx-4 flex justify-between border-t border-slate-100 py-3">
        <div><p className="text-[10px] text-slate-400">Precio</p><p className="text-sm font-extrabold">{money(p.price)}</p></div>
        <div className="text-right"><p className="text-[10px] text-slate-400">Stock disponible</p><p className="text-sm font-extrabold">{p.stock} uds.</p></div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/60 p-3">
        <button className="btn-ghost !py-2 text-xs" onClick={() => onEdit(p)}><Pencil size={14} />Editar</button>
        <button className="btn-danger !py-2 text-xs" onClick={() => onDelete(p)}><Trash2 size={14} />Eliminar</button>
      </div>
    </article>
  );
}
