import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, { type = "default", duration = 3000 } = {}) => {
    const key = ++id;
    setToasts((t) => [...t, { key, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((i) => i.key !== key)), duration);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 left-1/2 z-[300] flex -translate-x-1/2 flex-col items-center gap-2">
          <AnimatePresence mode="sync">
            {toasts.map((t) => (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                exit={{    opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-center gap-3 border border-[var(--border)] px-5 py-3 backdrop-blur-sm"
                style={{ background: "var(--bg-page)" }}
              >
                {t.type === "success" && (
                  <span className="h-1 w-1 rounded-full bg-[var(--text-main)]" />
                )}
                {t.type === "error" && (
                  <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
                )}
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-main)] whitespace-nowrap">
                  {t.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
