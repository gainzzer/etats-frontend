import { useState } from "react";
import http from "../services/http.js";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import ProfileCard from "../components/dashboard/ProfileCard.jsx";
import QuickStatsCard from "../components/dashboard/QuickStatsCard.jsx";
import UpcomingDeadlinesCard from "../components/dashboard/UpcomingDeadlinesCard.jsx";
import RecentTasksCard from "../components/dashboard/RecentTasksCard.jsx";
import WeatherCard from "../components/dashboard/WeatherCard.jsx";
import "../styles/dashboard.css";

if (!user && !booted) {
  setBooted(true);
  checkSession();
}

function safeParseUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getErrorMessage(err, fallback) {
  try {
    const msg = err?.response?.data?.message || err?.message || "";
    return String(msg).trim() || fallback;
  } catch {
    return fallback;
  }
}

function formatDate(value) {
  try {
    if (!value) return "-";
    return String(value).slice(0, 10);
  } catch {
    return "-";
  }
}

function dateOnlyString(value) {
  try {
    if (!value) return "";
    return String(value).slice(0, 10);
  } catch {
    return "";
  }
}

function startOfToday() {
  try {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  } catch {
    return new Date(0);
  }
}

function toDateOnly(value) {
  try {
    const s = dateOnlyString(value);
    if (!s) return null;

    const parts = s.split("-");
    if (parts.length !== 3) return null;

    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    if (!y || !m || !d) return null;

    return new Date(y, m - 1, d, 0, 0, 0, 0);
  } catch {
    return null;
  }
}

function addDays(date, days) {
  try {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  } catch {
    return date;
  }
}

function groupTasks(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const map = new Map();

  for (const r of list) {
    const taskId = r?.taskId ?? r?.task_id ?? null;
    if (!taskId) continue;

    const key = String(taskId);

    if (!map.has(key)) {
      map.set(key, {
        taskId,
        title: r?.title || "",
        priority: r?.priority || "Medium",
        dueDate: r?.dueDate || r?.due_date || null,
        status: r?.status || "Assigned",
        assignees: [],
      });
    }

    const t = map.get(key);

    const due = r?.dueDate || r?.due_date || null;
    if (!t.dueDate && due) t.dueDate = due;

    if (r?.status) t.status = r.status;

    const employeeId = r?.employeeId ?? r?.employee_id ?? null;
    if (employeeId) {
      const employeeName = r?.employeeName || r?.employee_name || `Employee ${employeeId}`;
      const exists = t.assignees.some((a) => String(a.employeeId) === String(employeeId));
      if (!exists) t.assignees.push({ employeeId, employeeName, status: r?.status || "Assigned" });
    }
  }

  return Array.from(map.values());
}

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const role = String(user?.role || "").toLowerCase();
  const isManager = role === "manager";
  const myEmployeeId = user?.employeeId || user?.employee_id || null;

  const [booted, setBooted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [me, setMe] = useState(null);
  const [taskRows, setTaskRows] = useState([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [error, setError] = useState("");

  async function checkSession() {
    try {
      const res = await http.get("/auth/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }
  
  async function loadDashboard() {
    try {
      setError("");
      setLoading(true);

      if (!user || !myEmployeeId) {
        setMe(null);
        setTaskRows([]);
        setEmployeesCount(0);
        return;
      }

      const empRes = await http.get("/employees/me");
      setMe(empRes.data || null);

      const tasksRes = await http.get(`/tasks/my/${myEmployeeId}`);
      setTaskRows(Array.isArray(tasksRes.data) ? tasksRes.data : []);

      if (isManager) {
        const eRes = await http.get("/employees");
        const list = Array.isArray(eRes.data) ? eRes.data : [];
        setEmployeesCount(list.length);
      } else {
        setEmployeesCount(0);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load dashboard"));
    } finally {
      setLoading(false);
    }
  }

  if (user && myEmployeeId && !booted) {
    setBooted(true);
    setTimeout(() => {
      try {
        loadDashboard();
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load dashboard"));
      }
    }, 0);
  }

  if (!user) return <div className="dash-page">Please login first.</div>;
  if (!myEmployeeId) return <div className="dash-page">Missing employee id.</div>;
  if (loading) return <div className="dash-page">Loading dashboard...</div>;

  const tasks = groupTasks(taskRows);

  const stats = {
    total: tasks.length,
    assigned: tasks.filter((t) => t.status === "Assigned").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Done").length,
  };

  const windowDays = 2;
  const today = startOfToday();
  const maxDate = addDays(today, windowDays);

  const upcoming = tasks
    .filter((t) => {
      const due = toDateOnly(t.dueDate);
      if (!due) return false;
      return due >= today && due <= maxDate;
    })
    .sort((a, b) => {
      const da = toDateOnly(a.dueDate);
      const db = toDateOnly(b.dueDate);
      return (da?.getTime() || 0) - (db?.getTime() || 0);
    })
    .slice(0, 5);

  const recent = tasks.slice(0, 5);

  return (
    <div className="dash-page">
      <DashboardHeader
        onRefresh={loadDashboard}
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="dash-grid">
        <ProfileCard user={user} me={me} isManager={isManager} employeeId={myEmployeeId} />
        <QuickStatsCard stats={stats} isManager={isManager} employeesCount={employeesCount} />
        <UpcomingDeadlinesCard upcoming={upcoming} formatDate={formatDate} />
      </div>

      <div className="dash-section">
        <WeatherCard />
      </div>

      <RecentTasksCard title="Your Recent Tasks" tasks={recent} formatDate={formatDate} />
    </div>
  );
}
