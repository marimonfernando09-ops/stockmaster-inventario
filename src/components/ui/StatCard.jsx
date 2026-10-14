export default function StatCard({ label, value, icon: Icon, tone = 'emerald', note }) {
  const tones = { emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', sky: 'bg-sky-50 text-sky-600', slate: 'bg-slate-100 text-slate-600' };
  return (
    <div className="card flex items-start justify-between p-5">
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1.5 text-2xl font-extrabold tracking-tight">{value}</p>
        {note && <p className="mt-1 text-[11px] text-slate-400">{note}</p>}
      </div>
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><Icon size={19} /></div>
    </div>
  );
}
