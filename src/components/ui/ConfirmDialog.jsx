import { AlertTriangle } from 'lucide-react';
export default function ConfirmDialog({ open, title, text, confirmLabel = 'Eliminar', onConfirm, onCancel, busy }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" className="card w-full max-w-sm animate-pop p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-rose-50 text-rose-500"><AlertTriangle size={22} /></div>
        <h3 className="text-base font-extrabold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn bg-rose-600 text-white hover:bg-rose-700" disabled={busy} onClick={onConfirm}>{busy ? 'Procesando…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
