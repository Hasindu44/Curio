import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  function loseHeart() {
    setUser((u) => (u ? { ...u, hearts: Math.max(0, u.hearts - 1) } : u));
  }

  function addXp(amount) {
    setUser((u) => (u ? { ...u, xp: u.xp + amount } : u));
  }

  function refillHearts() {
    setUser((u) => (u ? { ...u, hearts: u.maxHearts } : u));
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loseHeart, addXp, refillHearts }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
