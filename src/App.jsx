import { useState } from 'react';
import { InventoryProvider } from './context/InventoryContext';
import { sessionApi } from './services/api';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Toasts from './components/ui/Toasts';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Movements from './pages/Movements';

export default function App() {
  const [session, setSession] = useState(sessionApi.get());
  const [page, setPage] = useState('productos');
  if (!session) return <Login onLogin={(doc) => setSession(sessionApi.login(doc))} />;
  const logout = () => { sessionApi.logout(); setSession(null); };
  return (
    <InventoryProvider>
      <div className="flex min-h-screen">
        <Sidebar page={page} onNavigate={setPage} />
        <div className="min-w-0 flex-1">
          <Topbar page={page} onNavigate={setPage} session={session} onLogout={logout} />
          <main className="mx-auto max-w-6xl p-6">
            {page === 'panel' && <Dashboard onNavigate={setPage} />}
            {page === 'productos' && <Products onNavigate={setPage} />}
            {page === 'movimientos' && <Movements />}
            {page === 'auditoria' && <p className="card p-10 text-center text-sm text-slate-500">El historial de auditoría estará disponible próximamente. Mientras tanto, revisa las salidas en Movimientos.</p>}
          </main>
        </div>
      </div>
      <Toasts />
    </InventoryProvider>
  );
}
