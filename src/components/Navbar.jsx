import { Link, useNavigate } from "react-router-dom";

function safeParseUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const user = safeParseUser();
  const role = String(user?.role || "").toLowerCase();
  const isManager = role === "manager";

  function handleLogout() {
    try {
      localStorage.removeItem("user");
      navigate("/login");
    } catch {
      navigate("/login");
    }
  }

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/dashboard">
        ETATS
      </Link>

      {/* ✅ TOGGLER BUTTON */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#etatsNavbar"
        aria-controls="etatsNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* ✅ COLLAPSIBLE CONTENT */}
      <div className="collapse navbar-collapse" id="etatsNavbar">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/tasks">Tasks</Link>
          </li>

          {isManager && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/employees">Employees</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/reports">Reports</Link>
              </li>
            </>
          )}
        </ul>

        <div className="d-flex align-items-center gap-3">
          <span className="text-light">
            {user.name || user.email}
          </span>

          <button
            className="btn btn-outline-light btn-sm"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
