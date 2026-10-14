import { CheckCircle2, XCircle } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
export default function Toasts() {
  const { toasts } = useInventory();
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`flex animate-pop items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${t.type === 'error' ? 'bg-rose-600' : 'bg-brand-900'}`}>
          {t.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} className="text-emerald-400" />}{t.msg}
        </div>
      ))}
    </div>
  );
}
