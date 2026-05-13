import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { login, register } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full border-b border-[var(--border)] bg-transparent py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-soft)] outline-none transition-colors focus:border-[var(--text-main)]";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser }           = useAuth();
  const firstInputRef         = useRef(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
  });

  // Reset al abrir
  useEffect(() => {
    if (open) {
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setError("");
      setMode("login");
      setTimeout(() => firstInputRef.current?.focus(), 120);
    }
  }, [open]);

  // Cerrar con Escape
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
      const user = mode === "login"
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      setUser(user);
      onSuccess?.(user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error ?? "Ocurrió un error. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setMode((m) => m === "login" ? "register" : "login");
    setError("");
  };

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
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
                  M4RS
                </p>
                <h2 className="mt-1 text-lg font-light text-[var(--text-main)]">
                  {mode === "login" ? "Iniciá sesión" : "Creá tu cuenta"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[var(--text-soft)] transition-opacity hover:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                      Nombre
                    </p>
                    <input
                      ref={firstInputRef}
                      required
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                      Apellido
                    </p>
                    <input
                      required
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                  Email
                </p>
                <input
                  ref={mode === "login" ? firstInputRef : null}
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                  Contraseña
                </p>
                <input
                  required
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-[var(--text-main)] bg-[var(--text-main)] py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {loading
                  ? "..."
                  : mode === "login" ? "Ingresar" : "Crear cuenta"}
              </button>
            </form>

            {/* Toggle modo */}
            <p className="mt-6 text-center text-[10px] text-[var(--text-soft)]">
              {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}
              {" "}
              <button
                type="button"
                onClick={toggle}
                className="font-semibold uppercase tracking-wide text-[var(--text-main)] transition-opacity hover:opacity-50"
              >
                {mode === "login" ? "Registrate" : "Ingresá"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
