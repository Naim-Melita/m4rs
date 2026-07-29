import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{ background: "var(--bg-page)" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
          M4RS
        </p>
        <h1 className="mt-4 text-xl font-light text-[var(--text-main)]">
          Algo salió mal
        </h1>
        <p className="mt-3 max-w-xs text-xs text-[var(--text-soft)]">
          Recargá la página o volvé al inicio.
        </p>
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="border border-[var(--text-main)] bg-[var(--text-main)] px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--bg-page)] transition-opacity hover:opacity-80"
          >
            Recargar
          </button>
          <a
            href="/"
            className="border border-[var(--border)] px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
          >
            Inicio
          </a>
        </div>
      </div>
    );
  }
}
