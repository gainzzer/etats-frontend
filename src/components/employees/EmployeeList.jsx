function resolvePhotoUrl(input) {
  const url = String(input || "").trim();
  if (!url) return "";



  return url;
}

export default function EmployeeList({ employees, onEdit, onDelete }) {
  const list = Array.isArray(employees) ? employees : [];

  function handleEdit(emp) {
    try {
      onEdit?.(emp);
    } catch (err) {
      alert(err?.message || "Failed to select employee");
    }
  }

  function handleDelete(emp) {
    try {
      const res = onDelete?.(emp);
      if (res && typeof res.catch === "function") {
        res.catch((e) => alert(e?.message || "Failed to delete employee"));
      }
    } catch (err) {
      alert(err?.message || "Failed to delete employee");
    }
  }

  return (
    <div className="employees-card">
      <h4 className="employees-card-title">Employee List</h4>

      <ul className="list-group employees-list">
        {list.map((emp) => {
          const empId = emp?.employeeId ?? emp?.employee_id ?? "";
          const rawPhoto = emp?.photoUrl ?? emp?.photo_url ?? "";
          const photo = resolvePhotoUrl(rawPhoto);

          if (!empId) return null;

          return (
            <li key={String(empId)} className="list-group-item employees-item">
              <div className="d-flex align-items-start justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="emp-avatar-wrap">
                    <img
                      className="emp-avatar"
                      src={photo || "/vite.svg"}
                      alt="employee"
                      referrerPolicy="no-referrer"
                      onError={(e) => (e.currentTarget.src = "/vite.svg")}
                    />
                  </div>

                  <div>
                    <div className="employees-line1">
                      <strong>{emp?.name || "Employee"}</strong> — {empId} —{" "}
                      {String(emp?.role || "employee")}
                    </div>
                    <div className="employees-line2">
                      {emp?.email || "-"} • {emp?.department || "-"} • {emp?.status || "-"}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-primary" type="button" onClick={() => handleEdit(emp)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" type="button" onClick={() => handleDelete(emp)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}

        {list.length === 0 && (
          <li className="list-group-item employees-item">No employees yet</li>
        )}
      </ul>
    </div>
  );
}
