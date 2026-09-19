import { Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import DetailPage from "./Pages/DetailPage";
import NotFound from "./Pages/NotFound";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
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
          <img 
            src="../public/beacn.svg" 
            alt="Beacn" 
            width="24" 
            height="24" 
            style={{ display: 'block' }}
          />
        </Link>
      </nav>

      <div className="app-main">
        <header className="topbar">
          <span className="topbar-brand">Beacn</span>
        </header>

        <main className="content">
          <Routes>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path="/endpoints/:id" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}