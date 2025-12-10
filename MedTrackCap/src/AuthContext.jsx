// src/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login({ username, password }) {
    // In Preview Mode, MSW will intercept this and return { user: {...} }
    const res = await fetch("/api/auth/login", { method: "POST" });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setUser(data.user);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
