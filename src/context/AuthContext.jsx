import { createContext, useContext } from "react";
import { useSession, signOut } from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending, refetch } = useSession();

  const user    = session?.user ?? null;
  const loading = isPending;
  const isAdmin = user?.role === "ADMIN";

  const logout = async () => {
    await signOut();
  };

  const refreshUser = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
