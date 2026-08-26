import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/footer";
import { resetPassword } from "../lib/auth";
import { useToast } from "../context/ToastContext";

const inputClass =
  "w-full border-b border-[var(--border)] bg-transparent py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-soft)] outline-none transition-colors focus:border-[var(--text-main)]";

export default function ResetPassword() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const toast     = useToast();

  // Better Auth redirige acá con ?token=... , o ?error=INVALID_TOKEN si venció
  const token      = params.get("token");
  const tokenError = params.get("error");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await resetPassword({ newPassword: password, token });
      if (err) throw err;

      setDone(true);
      toast("Contraseña actualizada", { type: "success" });
      window.setTimeout(() => navigate("/"), 2500);
    } catch {
      setError("El enlace venció o ya fue usado. Pedí uno nuevo desde el inicio.");
    } finally {
      setLoading(false);
    }
  };

  const invalidLink = !token || tokenError;

  return (
    <>
      <Header darkOnTop />
      <main className="theme-page min-h-screen px-6 pt-32 pb-24">
        <div className="mx-auto max-w-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
            M4RS
          </p>

          {invalidLink ? (
            <>
              <h1 className="mt-2 text-2xl font-light tracking-wide text-[var(--text-main)]">
                Enlace inválido
              </h1>
              <div className="mt-8 border-t border-[var(--border)] pt-8">
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Este enlace venció o ya fue usado. Los enlaces de recuperación
                  duran una hora y sirven una sola vez.
                </p>
                <Link
                  to="/"
                  className="mt-8 block border-b border-[var(--text-main)] pb-0.5 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50"
                >
                  Volver al inicio
                </Link>
              </div>
            </>
          ) : done ? (
            <>
              <h1 className="mt-2 text-2xl font-light tracking-wide text-[var(--text-main)]">
                Listo
              </h1>
              <div className="mt-8 border-t border-[var(--border)] pt-8">
                <CheckCircle className="size-8 text-[var(--text-main)]" strokeWidth={1} />
                <p className="mt-6 text-sm leading-relaxed text-[var(--text-muted)]">
                  Tu contraseña quedó actualizada. Ya podés iniciar sesión con ella.
                </p>
                <p className="mt-4 text-[11px] text-[var(--text-soft)]">
                  Te llevamos al inicio en un momento.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-2 text-2xl font-light tracking-wide text-[var(--text-main)]">
                Nueva contraseña
              </h1>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6 border-t border-[var(--border)] pt-8">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                    Contraseña
                  </p>
                  <input
                    autoFocus
                    required type="password" minLength={8}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                  <p className="mt-2 text-[10px] text-[var(--text-soft)]">Mínimo 8 caracteres.</p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                    Repetir contraseña
                  </p>
                  <input
                    required type="password" minLength={8}
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p className="border-l-2 border-[var(--text-main)] pl-3 text-[11px] text-[var(--text-soft)]">
                    {error}
                  </p>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full border border-[var(--text-main)] bg-[var(--text-main)] py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] transition-opacity hover:opacity-80 disabled:opacity-40"
                >
                  {loading ? "..." : "Guardar contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
