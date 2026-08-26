import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { signIn, signUp, requestPasswordReset } from "../../lib/auth";
import { useToast } from "../../context/ToastContext";

function translateError(msg = "") {
  const m = msg.toLowerCase();
  if (m.includes("too many") || m.includes("rate"))               return "Demasiados intentos. Esperá unos minutos.";
  if (m.includes("password") && m.includes("least"))              return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("user already exists") || m.includes("already")) return "Ya existe una cuenta con ese email.";
  return "Email o contraseña incorrectos.";
}

const inputClass =
  "w-full border-b border-[var(--border)] bg-transparent py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-soft)] outline-none transition-colors focus:border-[var(--text-main)]";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode]       = useState("login");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const firstInputRef         = useRef(null);
  const toast                 = useToast();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
  });

  useEffect(() => {
    if (open) {
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setError("");
      setSent(false);
      setMode("login");
      setTimeout(() => firstInputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        await requestPasswordReset({
          email:      form.email,
          redirectTo: `${window.location.origin}/restablecer-password`,
        });
        // Confirmación idéntica exista o no la cuenta: si difiere,
        // el formulario revela qué emails están registrados.
        setSent(true);
        setLoading(false);
        return;
      }

      if (mode === "login") {
        const { error: err } = await signIn.email({
          email:    form.email,
          password: form.password,
        });
        if (err) throw err;
      } else {
        const { error: err } = await signUp.email({
          email:     form.email,
          password:  form.password,
          name:      `${form.firstName} ${form.lastName}`.trim(),
          firstName: form.firstName,
          lastName:  form.lastName,
        });
        if (err) throw err;
      }

      toast(mode === "login" ? "Sesión iniciada" : "Cuenta creada", { type: "success" });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(translateError(err?.message ?? err?.code ?? ""));
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setMode((m) => m === "login" ? "register" : "login");
    setError("");
  };

  const goTo = (next) => {
    setMode(next);
    setError("");
    setSent(false);
  };

  const title = {
    login:    "Iniciá sesión",
    register: "Creá tu cuenta",
    forgot:   "Recuperá tu acceso",
  }[mode];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-sm p-8"
            style={{ background: "var(--bg-page)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
                  M4RS
                </p>
                <h2 className="mt-1 text-lg font-light text-[var(--text-main)]">
                  {title}
                </h2>
              </div>
              <button type="button" onClick={onClose} className="text-[var(--text-soft)] transition-opacity hover:opacity-50">
                <X className="size-4" />
              </button>
            </div>

            {sent ? (
              <div>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Si hay una cuenta asociada a <span className="text-[var(--text-main)]">{form.email}</span>,
                  te enviamos un enlace para crear una contraseña nueva.
                </p>
                <p className="mt-4 text-[11px] leading-relaxed text-[var(--text-soft)]">
                  Vence en una hora. Revisá el correo no deseado si no lo ves.
                </p>
                <button
                  type="button"
                  onClick={() => goTo("login")}
                  className="mt-8 w-full border border-[var(--text-main)] bg-[var(--text-main)] py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] transition-opacity hover:opacity-80"
                >
                  Volver
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "forgot" && (
                <p className="text-[11px] leading-relaxed text-[var(--text-soft)]">
                  Ingresá tu email y te mandamos un enlace para elegir una contraseña nueva.
                </p>
              )}

              {mode === "register" && (
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">Nombre</p>
                    <input ref={firstInputRef} required name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">Apellido</p>
                    <input required name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">Email</p>
                <input
                  ref={mode === "register" ? null : firstInputRef}
                  required type="email" name="email"
                  value={form.email} onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">Contraseña</p>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => goTo("forgot")}
                        className="text-[10px] tracking-wide text-[var(--text-soft)] underline underline-offset-2 transition-opacity hover:opacity-50"
                      >
                        ¿La olvidaste?
                      </button>
                    )}
                  </div>
                  <input
                    required type="password" name="password"
                    value={form.password} onChange={handleChange}
                    minLength={8} className={inputClass}
                  />
                </div>
              )}

              {error && (
                <p className="border-l-2 border-[var(--text-main)] pl-3 text-[11px] text-[var(--text-soft)]">
                  {error}
                </p>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full border border-[var(--text-main)] bg-[var(--text-main)] py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {loading
                  ? "..."
                  : mode === "login"  ? "Ingresar"
                  : mode === "forgot" ? "Enviar enlace"
                  : "Crear cuenta"}
              </button>
            </form>
            )}

            {!sent && (
              <p className="mt-6 text-center text-[10px] text-[var(--text-soft)]">
                {mode === "forgot" ? (
                  <button type="button" onClick={() => goTo("login")} className="font-semibold uppercase tracking-wide text-[var(--text-main)] transition-opacity hover:opacity-50">
                    Volver a iniciar sesión
                  </button>
                ) : (
                  <>
                    {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
                    <button type="button" onClick={toggle} className="font-semibold uppercase tracking-wide text-[var(--text-main)] transition-opacity hover:opacity-50">
                      {mode === "login" ? "Registrate" : "Ingresá"}
                    </button>
                  </>
                )}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
