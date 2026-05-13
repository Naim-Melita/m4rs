import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/footer";

const STATES = {
  approved: {
    icon:    CheckCircle,
    title:   "Pago aprobado",
    body:    "Tu pedido fue confirmado. Te contactaremos a la brevedad.",
  },
  pending: {
    icon:    Clock,
    title:   "Pago en proceso",
    body:    "Tu pago está siendo procesado. Te avisaremos cuando se confirme.",
  },
  failure: {
    icon:    XCircle,
    title:   "Pago rechazado",
    body:    "No pudimos procesar tu pago. Podés volver e intentar con otro medio.",
  },
};

export default function PaymentResult() {
  const [params] = useSearchParams();
  // MP envía collection_status o status
  const status    = params.get("collection_status") ?? params.get("status") ?? "failure";
  const paymentId = params.get("payment_id") ?? params.get("collection_id");

  const state = STATES[status] ?? STATES.failure;
  const Icon  = state.icon;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header darkOnTop />

      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <Icon
          className="mb-6 size-10"
          strokeWidth={1}
          style={{ color: "var(--text-main)" }}
        />

        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
          M4RS
        </p>
        <h1 className="mt-3 text-xl font-light text-[var(--text-main)]">
          {state.title}
        </h1>
        <p className="mt-3 max-w-xs text-xs text-[var(--text-soft)]">
          {state.body}
        </p>

        {paymentId && (
          <p className="mt-3 text-[10px] text-[var(--text-soft)]">
            Referencia #{paymentId}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/"
            className="border-b border-[var(--text-main)] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50"
          >
            Volver al inicio
          </Link>
          {status === "failure" && (
            <Link
              to="/checkout"
              className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
            >
              Reintentar pago
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
