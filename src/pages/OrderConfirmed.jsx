import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/footer";

export default function OrderConfirmedPage() {
  const [params] = useSearchParams();
  const orderId  = params.get("id");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header darkOnTop />

      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <CheckCircle
          className="mb-6 size-10 text-[var(--text-main)]"
          strokeWidth={1}
        />
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
          M4RS
        </p>
        <h1 className="mt-3 text-2xl font-light text-[var(--text-main)]">
          ¡Gracias por tu pedido!
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-soft)]">
          Tu orden fue registrada. Te contactaremos para coordinar el pago y la entrega.
          Podés consultar el estado de tu pedido en cualquier momento.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          {orderId && (
            <Link
              to={`/mis-pedidos`}
              className="border border-[var(--text-main)] bg-[var(--text-main)] px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--bg-page)] no-underline transition-opacity hover:opacity-80"
            >
              Ver estado del pedido
            </Link>
          )}
          <Link
            to="/"
            className="border border-[var(--border)] px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
          >
            Seguir explorando
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
