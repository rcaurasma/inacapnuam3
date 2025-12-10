import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Corredor" });

  return (
    <div className="auth-page">
      <div className="auth-card">
      <h2>Crear cuenta</h2>
      <p>Configura acceso para nuevos usuarios.</p>

      <div className="auth-grid">
        <input
          className="input"
          placeholder="Nombre completo"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
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
        <select
          className="select"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option>Corredor</option>
          <option>Auditor</option>
          <option>Administrador</option>
        </select>
        <div className="auth-actions">
          <button className="btn primary" onClick={() => onSubmit?.(form)}>
            Registrar
          </button>
          <button
            className="btn ghost"
            onClick={() => setForm({ name: "", email: "", password: "", role: "Corredor" })}
          >
            Limpiar
          </button>
          <Link className="btn ghost" to="/login">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}
