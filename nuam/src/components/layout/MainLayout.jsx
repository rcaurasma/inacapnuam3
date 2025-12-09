import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
