import { createContext, useContext, useEffect, useState } from "react";
import { logout as clearSession } from "../api/auth";
import { fetchCurrentUser } from "../api/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // True after a deliberate logout, so login does not send the next user back
  // to the previous user's page.
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch((error) => {
        // A stale or invalid token should not keep failing on every visit.
        if (error?.response?.status === 401) clearSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    clearSession();
    localStorage.removeItem("axiom_active_course");
    localStorage.removeItem("axiom_course_profiles");
    setLoggedOut(true);
    setUser(null);
  }

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
    <AuthContext.Provider value={{ user, setUser, loading, loggedOut, logout, loseHeart, addXp, refillHearts }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
