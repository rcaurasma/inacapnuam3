import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ items = [], active }) {
	return (
		<aside className="sidebar">
			<nav className="sidebar-nav">
				{items.map(item => (
					<NavLink
						key={item.id}
						to={item.path}
						className={({ isActive }) => `sidebar-item ${isActive || item.id === active ? 'active' : ''}`}
						onClick={item.onClick}
					>
						<span aria-hidden="true">{item.icon}</span>
						{item.label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
