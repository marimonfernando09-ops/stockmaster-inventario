// Simulación de API REST sobre localStorage (latencia artificial + validaciones de servidor).
// Para pasar a un backend real, reemplaza solo este archivo manteniendo las mismas firmas.
import { nextCode, uid } from '../utils/format';

const K = { products: 'sm_products', movements: 'sm_movements', session: 'sm_session' };
const wait = (ms = 220) => new Promise((r) => setTimeout(r, ms));
const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const seedProducts = [
  { name: 'Taladro Percutor Industrial 750W', description: 'Motor de alto torque con caja de engranajes metálica para obra pesada.', price: 149.99, stock: 45 },
  { name: 'Sierra Circular 1800W Profesional', description: 'Disco de 7-1/4, guiada con guía láser integrada, tapete de magnesio.', price: 210.8, stock: 8 },
  { name: 'Amoladora Angular 4-1/2" 850W', description: 'Diseño ergonómico compacto para corte y desbaste rápido de metales.', price: 78.5, stock: 82 },
  { name: 'Sensor Óptico Industrial X-90', description: 'Detección de presencia por infrarrojo, alcance de 2 m, carcasa IP67.', price: 1500, stock: 24 },
  { name: 'Motor Paso a Paso NEMA 23', description: 'Par de 1.9 Nm, ideal para CNC y automatización de bandas.', price: 899.9, stock: 0 },
];
const ensure = () => {
  if (!localStorage.getItem(K.products)) {
    const t = Date.now();
    write(K.products, seedProducts.map((p, i) => ({ ...p, id: uid(), sku: `SKU-${String(i + 1).padStart(4, '0')}`, createdAt: t - i * 1000 })));
  }
  if (!localStorage.getItem(K.movements)) write(K.movements, []);
};

export const productsApi = {
  async list() { ensure(); await wait(); return read(K.products, []).sort((a, b) => b.createdAt - a.createdAt); },
  async create(data) {
    await wait(); const all = read(K.products, []);
    const p = { ...data, id: uid(), sku: nextCode('SKU', all, 'sku'), createdAt: Date.now() };
    write(K.products, [p, ...all]); return p;
  },
  async update(id, data) {
    await wait(); const all = read(K.products, []);
    if (!all.some((p) => p.id === id)) throw new Error('El producto ya no existe');
    write(K.products, all.map((p) => (p.id === id ? { ...p, ...data } : p)));
  },
  async remove(id) { await wait(); write(K.products, read(K.products, []).filter((p) => p.id !== id)); },
};

export const movementsApi = {
  async list() { ensure(); await wait(100); return read(K.movements, []); },
  async create({ productId, qty, price, date, time }) {
    await wait(); const products = read(K.products, []); const movs = read(K.movements, []);
    const p = products.find((x) => x.id === productId);
    if (!p) throw new Error('Selecciona un producto válido');
    if (qty > p.stock) throw new Error(`Stock insuficiente: solo hay ${p.stock} uds. de ${p.name}`);
    write(K.products, products.map((x) => (x.id === p.id ? { ...x, stock: x.stock - qty } : x)));
    const m = { id: uid(), code: nextCode('MOV', movs, 'code'), productId, productName: p.name, sku: p.sku, qty, price, date, time, createdAt: Date.now() };
    write(K.movements, [m, ...movs]); return m;
  },
  async remove(id) { // anular una salida devuelve las unidades al stock
    await wait(); const movs = read(K.movements, []); const m = movs.find((x) => x.id === id); if (!m) return;
    write(K.products, read(K.products, []).map((p) => (p.id === m.productId ? { ...p, stock: p.stock + m.qty } : p)));
    write(K.movements, movs.filter((x) => x.id !== id));
  },
};

export const sessionApi = {
  get: () => read(K.session, null),
  login: (doc) => { const s = { doc, name: 'Carlos Mendoza', role: 'Administrador' }; write(K.session, s); return s; },
  logout: () => localStorage.removeItem(K.session),
};
