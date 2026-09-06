import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">✓</div>

        <div className="logo-text">
          <h2>AMS</h2>
          <span>Attendance System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        <button
          className={`menu-item ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <span></span>
          Dashboard
        </button>

        <button
          className={`menu-item ${
            location.pathname === "/employees" ? "active" : ""
          }`}
          onClick={() => navigate("/employees")}
        >
          <span></span>
          Employees
        </button>

        <button
          className={`menu-item ${
            location.pathname === "/attendance" ? "active" : ""
          }`}
          onClick={() => navigate("/attendance")}
        >
          <span></span>
          Attendance
        </button>
      </nav>

      {/* Logout */}
      <button className="logout-button" onClick={handleLogout}>
        <span></span>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
