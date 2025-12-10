import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";

export default function MainLayout({
	user,
	sidebarItems,
	active,
	onDashboard,
	onLogin,
	onRegister,
	children,
}) {
	return (
		<div className="app-shell">
			<Sidebar items={sidebarItems} active={active} />
			<div className="layout-content">
				<Header
					user={user}
					onDashboard={onDashboard}
					onLogin={onLogin}
					onRegister={onRegister}
				/>
				<main className="page">{children || <Outlet />}</main>
				<Footer />
			</div>
		</div>
	);
}
