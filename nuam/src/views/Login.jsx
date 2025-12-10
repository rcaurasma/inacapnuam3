import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ onSubmit }) {
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Inicio de sesion</h2>
        <p>Ingresa con tus credenciales</p>

        <div className="auth-grid">
          <input
            className="input"
            type="email"
            placeholder="Correo corporativo"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <div className="auth-actions">
            <button className="btn primary" onClick={() => onSubmit?.(form)}>
              Ingresar
            </button>
            <Link className="btn ghost" to="/register">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
