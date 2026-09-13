import { Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import DetailPage from "./Pages/DetailPage";
import NotFound from "./Pages/NotFound";
import "./App.css";

export default function App() {
  let location = useLocation();

  return (
    <div className="app-shell">
      <nav className="nav-rail">
        <Link
          to="/"
          className={`nav-icon ${location.pathname === "/" ? "nav-icon--active" : ""}`}
          title="Dashboard"
        >
        </Link>
      </nav>

      <div className="app-main">
        <header className="topbar">
          <span className="topbar-brand">Beacn</span>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/endpoints/:id" element={<DetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}