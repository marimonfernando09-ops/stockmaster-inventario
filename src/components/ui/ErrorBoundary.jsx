import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  reset = () => { localStorage.clear(); location.reload(); };
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="card w-full max-w-lg p-8">
          <h1 className="text-xl font-extrabold text-rose-600">Algo salió mal</h1>
          <p className="mt-1 text-sm text-slate-500">La aplicación encontró un error. Detalle técnico:</p>
          <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-rose-200">{String(this.state.error?.stack || this.state.error)}</pre>
          <div className="mt-4 flex gap-2">
            <button className="btn-ghost" onClick={() => location.reload()}>Reintentar</button>
            <button className="btn-danger" onClick={this.reset}>Restablecer datos locales</button>
          </div>
        </div>
      </main>
    );
  }
}
