// src/Pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../Components/InputField";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const loginFn = auth?.login; // puede ser undefined si no hay provider

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return setMessage("Username Required");
    if (!password.trim()) return setMessage("Password Required");

    try {
      if (loginFn) {
        //En este caso, no hay provider, pero en prod si lo habra:
      await loginFn({ username, password });
      setMessage("Login Successful");
    } else {
      // Modo demo: simula login exitoso
      console.warn("AuthContext no disponible, usando login simulado.");
      setMessage("Demo Login (sin AuthContext)");
    }
      navigate("/dashboard");
  } catch (err) {
    console.error(err);
    setMessage("Invalid username or password");

  }
};
  

  return (
    <main className="page login-page">
      <section className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleLogin} className="login-form">
          <InputField
            label="Email"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <InputField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
          />

          {message && <p className="login-message">{message}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register here
          </Link>
        </p>
      </section>
    </main>
  );
}
