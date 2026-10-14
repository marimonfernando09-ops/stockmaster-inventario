import { ArrowLeftRight, LayoutDashboard, PackagePlus, ShieldCheck } from 'lucide-react';
import Logo from '../ui/Logo';
export const NAV = [
  { id: 'panel', label: 'Panel Principal', icon: LayoutDashboard },
  { id: 'productos', label: 'Registro de Productos', icon: PackagePlus },
  { id: 'movimientos', label: 'Registro de Movimientos', icon: ArrowLeftRight },
  { id: 'auditoria', label: 'Historial de Auditoría', icon: ShieldCheck },
];
export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-gradient-to-b from-brand-900 to-brand-950 p-5 lg:flex">
      <Logo compact light />
      <p className="mb-2 mt-9 px-3 text-[11px] font-bold text-emerald-200/50">Operaciones</p>
      <nav className="space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)} aria-current={page === id}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${page === id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'text-emerald-50/70 hover:bg-white/5 hover:text-white'}`}>
            <Icon size={18} />{label}
          </button>
        ))}
      </nav>
      <p className="mt-auto rounded-xl bg-white/5 p-3 text-[11px] leading-relaxed text-emerald-100/60">Datos guardados en este navegador (localStorage).</p>
    </aside>
  );
}
