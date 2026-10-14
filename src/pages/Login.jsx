import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, CreditCard, Lock } from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function Login({ onLogin }) {
  const [doc, setDoc] = useState('');
  const [pin, setPin] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{5,12}$/.test(doc)) return setErr('El documento debe tener entre 5 y 12 dígitos.');
    if (!/^\d{4,8}$/.test(pin)) return setErr('La clave numérica debe tener entre 4 y 8 dígitos.');
    onLogin(doc);
  };
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-100 via-emerald-50/60 to-slate-100 p-4">
      <form onSubmit={submit} noValidate className="card w-full max-w-md animate-pop p-9 shadow-xl shadow-brand-900/5">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <div className="mt-3 flex items-center gap-2"><span className="text-xl font-extrabold text-brand-900">StockMaster</span><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">PRO v4.2</span></div>
          <h1 className="mt-1 text-2xl font-extrabold text-brand-900">Acceso al sistema</h1>
          <p className="text-xs text-slate-400">Plataforma centralizada de control de inventario</p>
        </div>
        <label className="label" htmlFor="doc">Número de documento</label>
        <div className="relative mb-4"><CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input id="doc" inputMode="numeric" className="field !pl-10" placeholder="Ej. 1098234891" value={doc} onChange={(e) => setDoc(e.target.value.replace(/\D/g, ''))} /></div>
        <label className="label" htmlFor="pin">Contraseña numérica</label>
        <div className="relative"><Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input id="pin" inputMode="numeric" type={show ? 'text' : 'password'} className="field !px-10" placeholder="••••••••" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Mostrar u ocultar clave">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
        <p className="hint">Demo: cualquier documento (5+ dígitos) y clave (4+ dígitos).</p>
        {err && <p role="alert" className="err mt-3 text-xs">{err}</p>}
        <button className="btn-primary mt-6 w-full !py-3">Ingresar al sistema <ArrowRight size={16} /></button>
        <p className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-[11px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Servidores operativos</p>
      </form>
    </main>
  );
}
