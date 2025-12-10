import React from "react";

export default function Header({ user, onDashboard, onLogin, onRegister }) {
	return (
		<header className="header">
			<div className="header-brand">
				<span className="header-logo">N</span>
				<div>
					<strong>Nuam Exchange</strong>
					<small>Calificaciones tributarias</small>
				</div>
			</div>

			<div className="header-actions">
				<button className="btn ghost" onClick={onDashboard}>Dashboard</button>
				<button className="btn ghost" onClick={onLogin}>Ingresar</button>
				<button className="btn primary" onClick={onRegister}>Crear cuenta</button>

				{user && (
					<div className="header-user">
						<div className="user-avatar">
							{user.initials || "NA"}
						</div>
						<div className="user-info">
							<div className="user-name">{user.name}</div>
							<div className="user-role">{user.role}</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
