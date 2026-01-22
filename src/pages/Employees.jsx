// frontend/src/pages/Employees.jsx
import { useEffect, useState } from "react";
import http from "../services/http.js";
import EmployeesHeader from "../components/employees/EmployeesHeader.jsx";
import EmployeeList from "../components/employees/EmployeeList.jsx";
import EmployeeEditor from "../components/employees/EmployeeEditor.jsx";
import "../styles/employees.css";

const EMPTY_FORM = {
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  photoUrl: "",
  role: "employee",
  status: "Active",
  hireDate: "",
  password: "",
};

function safeParseUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Employees() {
  const user = safeParseUser();
  const role = String(user?.role || "").toLowerCase();
  const isManager = role === "manager";

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadEmployees() {
    try {
      setLoading(true);
      const res = await http.get("/employees");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    if (!isManager) return;
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    try {
      const { name, value } = e.target;
      setForm((p) => ({ ...p, [name]: value }));
    } catch (err) {
      alert(err?.message || "Failed to update form");
    }
  }

  function resetForm() {
    setSelected(null);
    setForm(EMPTY_FORM);
  }

  function fillFormFromEmployee(emp) {
    try {
      const employeeId = emp?.employeeId ?? emp?.employee_id ?? "";
      setSelected({ ...emp, employeeId });

      setForm({
        employeeId,
        name: emp?.name ?? "",
        email: emp?.email ?? "",
        phone: emp?.phone ?? "",
        department: emp?.department ?? "",
        designation: emp?.designation ?? "",
        photoUrl: emp?.photoUrl ?? emp?.photo_url ?? "",
        role: String(emp?.role ?? "employee").toLowerCase() === "manager" ? "manager" : "employee",
        status: emp?.status ?? "Active",
        hireDate: String(emp?.hireDate ?? emp?.hire_date ?? "").slice(0, 10),
        password: "",
      });
    } catch (err) {
      alert(err?.message || "Failed to load employee into form");
    }
  }

  async function handleAdd() {
    try {
      const employeeId = String(form.employeeId || "").trim();
      const name = String(form.name || "").trim();
      const email = String(form.email || "").trim();
      const password = String(form.password || "");

      if (!employeeId || !name || !email || !password) {
        alert("Employee ID, name, email, and password are required");
        return;
      }

      await http.post("/employees", {
        ...form,
        employeeId,
        name,
        email,
      });

      resetForm();
      await loadEmployees();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to add employee");
    }
  }

  async function handleUpdate() {
    try {
      if (!selected) return;

      const empId = selected.employeeId;
      if (!empId) return;

      const payload = { ...form };
      if (!String(payload.password || "").trim()) delete payload.password;

      await http.put(`/employees/${empId}`, payload);

      resetForm();
      await loadEmployees();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to update employee");
    }
  }

  async function handleDelete(emp) {
    try {
      const empId = emp?.employeeId ?? emp?.employee_id ?? "";
      if (!empId) return;

      const ok = window.confirm("Delete this employee?");
      if (!ok) return;

      await http.delete(`/employees/${empId}`);
      await loadEmployees();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to delete employee");
    }
  }

  if (!user) return <div className="employees-page">Please login first.</div>;
  if (!isManager) return <div className="employees-page">Manager only.</div>;

  return (
    <div className="employees-page">
      <div className="container mt-4">
        <EmployeesHeader onNew={resetForm} onRefresh={loadEmployees} />

        <div className="row mt-3">
          <div className="col-md-6">
            {loading ? (
              <div className="text-muted">Loading...</div>
            ) : (
              <EmployeeList employees={employees} onEdit={fillFormFromEmployee} onDelete={handleDelete} />
            )}
          </div>

          <div className="col-md-6">
            <EmployeeEditor
              selected={selected}
              form={form}
              onChange={handleChange}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onClear={resetForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
