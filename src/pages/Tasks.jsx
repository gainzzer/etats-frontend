import { useState } from "react";
import http from "../services/http.js";
import TaskForm from "../components/tasks/TaskForm.jsx";
import TaskTable from "../components/tasks/TaskTable.jsx";
import TaskEditModal from "../components/tasks/TaskEditModal.jsx";
import "../styles/tasks.css";

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
    const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "";
    return String(msg).trim() || fallback;
  } catch {
    return fallback;
  }
}

function getTaskId(row) {
  return row?.taskId ?? row?.task_id ?? row?.id ?? null;
}

function getEmployeeId(row) {
  return row?.employeeId ?? row?.employee_id ?? null;
}

function getEmployeeName(row) {
  return row?.employeeName ?? row?.employee_name ?? row?.name ?? null;
}

function groupManagerTasks(rows) {
  const map = new Map();
  const list = Array.isArray(rows) ? rows : [];

  for (const r of list) {
    const taskId = getTaskId(r);
    if (!taskId) continue;

    const key = String(taskId);
    const rawDesc = r?.description ?? r?.taskDescription ?? r?.task_description ?? r?.desc ?? "";

    if (!map.has(key)) {
      map.set(key, {
        taskId,
        title: r?.title || "",
        description: String(rawDesc || "").trim(),
        priority: r?.priority || "Medium",
        dueDate: r?.dueDate || r?.due_date || null,
        status: r?.status || "Pending",
        assignees: [],
      });
    }

    const t = map.get(key);

    if (!t.description) {
      const d = String(rawDesc || "").trim();
      if (d) t.description = d;
    }

    if (r?.status) t.status = r.status;

    const employeeId = getEmployeeId(r);
    if (employeeId) {
      const employeeName = getEmployeeName(r) || `Employee ${employeeId}`;
      if (!t.assignees.some((a) => String(a.employeeId) === String(employeeId))) {
        t.assignees.push({ employeeId, employeeName });
      }
    }
  }

  return Array.from(map.values());
}

function idsFromTask(task) {
  try {
    if (!task) return [];

    if (Array.isArray(task.employeeIds)) return task.employeeIds.map(String).filter(Boolean);
    if (Array.isArray(task.assigneeIds)) return task.assigneeIds.map(String).filter(Boolean);

    if (Array.isArray(task.assignees)) {
      return task.assignees.map((a) => a?.employeeId).filter(Boolean).map(String);
    }

    if (Array.isArray(task.employees)) {
      return task.employees.map((e) => e?.employeeId ?? e?.employee_id).filter(Boolean).map(String);
    }

    return [];
  } catch {
    return [];
  }
}

export default function Tasks() {
  const user = safeParseUser();
  const role = String(user?.role || "").toLowerCase();
  const isManager = role === "manager";
  const myEmployeeId = user?.employeeId || user?.employee_id || null;

  const [booted, setBooted] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "High",
    dueDate: "",
    employeeIds: [],
    status: "Pending",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");
      setLoading(true);

      const url = isManager ? "/tasks" : myEmployeeId ? `/tasks/my/${myEmployeeId}` : "/tasks/my/0";
      const res = await http.get(url);

      const rows = Array.isArray(res.data) ? res.data : [];
      const next = isManager ? groupManagerTasks(rows) : rows;

      setTasks(next);
      return next;
    } catch (e) {
      setTasks([]);
      setError(getErrorMessage(e, "Failed to load tasks"));
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadEmployees() {
    try {
      setError("");
      const res = await http.get("/employees");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setEmployees([]);
      setError(getErrorMessage(e, "Failed to load employees"));
    }
  }

  if (user && !booted) {
    setBooted(true);
    setTimeout(() => {
      try {
        (async () => {
          await loadTasks();

          if (isManager) {
            await loadEmployees();
            setForm((p) => ({ ...p, employeeIds: Array.isArray(p.employeeIds) ? p.employeeIds : [] }));
          } else if (myEmployeeId) {
            setForm((p) => ({ ...p, employeeIds: [String(myEmployeeId)] }));
          }
        })();
      } catch (e) {
        setError(getErrorMessage(e, "Failed to load page"));
      }
    }, 0);
  }

  function handleChange(e) {
    try {
      const { name, value } = e.target;
      setForm((p) => ({ ...p, [name]: value }));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update form"));
    }
  }

  function toggleEmployee(id) {
    try {
      const sid = String(id);
      setForm((p) => {
        const list = Array.isArray(p.employeeIds) ? p.employeeIds : [];
        return {
          ...p,
          employeeIds: list.includes(sid) ? list.filter((x) => x !== sid) : [...list, sid],
        };
      });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update assignees"));
    }
  }

  function resetForm() {
    try {
      setForm({
        title: "",
        description: "",
        priority: "High",
        dueDate: "",
        employeeIds: isManager ? [] : myEmployeeId ? [String(myEmployeeId)] : [],
        status: "Pending",
      });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to reset form"));
    }
  }

  async function createTask(e) {
    try {
      e.preventDefault();
      setError("");

      const title = String(form.title || "").trim();
      if (!title) return setError("Title required");

      await http.post("/tasks", {
        title,
        description: String(form.description || ""),
        priority: form.priority,
        dueDate: form.dueDate || null,
        employeeIds: Array.isArray(form.employeeIds) ? form.employeeIds.map(String) : [],
        status: form.status,
      });

      resetForm();
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create task"));
    }
  }

  function openEdit(task) {
    try {
      setError("");

      const taskId = getTaskId(task);
      if (!taskId) return setError("Invalid task");

      const description = task?.description ?? task?.taskDescription ?? task?.task_description ?? "";
      const employeeIds = idsFromTask(task);

      setEditing({
        taskId,
        title: task?.title || "",
        description: String(description || ""),
        priority: task?.priority || "Medium",
        dueDate: task?.dueDate ? String(task.dueDate).slice(0, 10) : "",
        employeeIds,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to open edit"));
    }
  }

  async function submitEdit(e) {
    try {
      e.preventDefault();
      setError("");

      if (!editing) return setError("No task selected");

      const title = String(editing.title || "").trim();
      if (!title) return setError("Title required");

      const desiredIds = Array.isArray(editing.employeeIds) ? editing.employeeIds.map(String).filter(Boolean) : [];

      await http.put(`/tasks/${editing.taskId}`, {
        taskId: editing.taskId,
        title,
        description: String(editing.description || ""),
        priority: editing.priority,
        dueDate: editing.dueDate || null,
        employeeIds: desiredIds,
      });

      setEditing(null);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update task"));
    }
  }

  async function deleteTask(taskId) {
    try {
      setError("");
      if (!taskId) return;

      const ok = confirm("Delete task?");
      if (!ok) return;

      await http.delete(`/tasks/${taskId}`);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete task"));
    }
  }


  async function changeStatus(taskId, status) {
    try {
      setError("");
      if (!taskId) return;

      await http.put(`/tasks/${taskId}/status`, { status });
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update status"));
    }
  }

  if (!user) return <div className="container mt-4">Login first</div>;

  return (
    <div className="tasks-page container mt-4">
      <h2>Tasks</h2>

      {error ? <div className="alert alert-danger mt-3">{error}</div> : null}

      {isManager ? (
        <TaskForm
          form={form}
          employees={employees}
          onChange={handleChange}
          onToggleEmployee={toggleEmployee}
          onSubmit={createTask}
          onClear={resetForm}
        />
      ) : null}

      {loading ? (
        <div className="text-muted mt-3">Loading...</div>
      ) : (
        <TaskTable
          tasks={tasks}
          isManager={isManager}
          onEdit={openEdit}
          onDelete={deleteTask}
          onStatusChange={changeStatus}
        />
      )}

      {isManager ? (
        <TaskEditModal
          editing={editing}
          setEditing={setEditing}
          employees={employees}
          onSubmit={submitEdit}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}
