import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { movementsApi, productsApi } from '../services/api';
import { uid } from '../utils/format';

const Ctx = createContext(null);
export const useInventory = () => useContext(Ctx);

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((msg, type = 'ok') => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const refresh = useCallback(async () => {
    const [p, m] = await Promise.all([productsApi.list(), movementsApi.list()]);
    setProducts(p); setMovements(m);
  }, []);
  useEffect(() => { refresh().finally(() => setLoading(false)); }, [refresh]);

  const run = useCallback(async (fn, ok) => {
    try { const r = await fn(); await refresh(); notify(ok); return r; }
    catch (e) { notify(e.message || 'Ocurrió un error', 'error'); throw e; }
  }, [refresh, notify]);

  const value = useMemo(() => ({
    products, movements, loading, toasts, notify,
    addProduct: (d) => run(() => productsApi.create(d), 'Producto registrado'),
    updateProduct: (id, d) => run(() => productsApi.update(id, d), 'Producto actualizado'),
    removeProduct: (id) => run(() => productsApi.remove(id), 'Producto eliminado'),
    addMovement: (d) => run(() => movementsApi.create(d), 'Salida registrada y stock actualizado'),
    removeMovement: (id) => run(() => movementsApi.remove(id), 'Salida anulada, stock restituido'),
  }), [products, movements, loading, toasts, notify, run]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
