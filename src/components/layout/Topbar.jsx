import { Bell, LogOut } from "lucide-react";
const TABS = [
  ["panel", "Resumen"],
  ["productos", "Productos"],
  ["movimientos", "Movimientos"],
  ["auditoria", "Auditoría"],
];
export default function Topbar({ page, onNavigate, session, onLogout }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-6 py-3 backdrop-blur">
      <nav className="flex gap-1 overflow-x-auto">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${page === id ? "text-emerald-700 underline decoration-2 underline-offset-[10px]" : "text-slate-500 hover:text-slate-800"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <button
          className="relative text-slate-400 hover:text-slate-700"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
      </div>
      <button
        onClick={onLogout}
        className="btn-ghost !px-3 !py-2"
        aria-label="Cerrar sesión"
      >
        <LogOut size={16} />
      </button>
    </header>
  );
}
