import { Archive } from 'lucide-react';
export default function Logo({ light = false, compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`grid place-items-center rounded-xl ${compact ? 'h-9 w-9' : 'h-12 w-12'} ${light ? 'bg-emerald-500 text-white' : 'bg-brand-900 text-white'}`}>
        <Archive size={compact ? 18 : 24} />
      </div>
      {compact && (
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-white">StockMaster</p>
          <p className="text-[11px] text-emerald-200/70">Control de inventario</p>
        </div>
      )}
    </div>
  );
}
