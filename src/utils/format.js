export const money = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n || 0);
export const today = () => new Date().toISOString().slice(0, 10);
export const nowTime = () => new Date().toTimeString().slice(0, 5);
export const stockStatus = (s) =>
  s <= 0 ? { label: 'Agotado', cls: 'bg-rose-50 text-rose-600 border-rose-200' }
  : s <= 10 ? { label: 'Stock bajo', cls: 'bg-amber-50 text-amber-600 border-amber-200' }
  : { label: 'Stock alto', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
export const nextCode = (prefix, list, key) => {
  const max = list.reduce((m, x) => Math.max(m, parseInt(String(x[key]).replace(/\D/g, ''), 10) || 0), 0);
  return `${prefix}-${String(max + 1).padStart(4, '0')}`;
};
export const downloadCSV = (rows, name) => {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
};
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
