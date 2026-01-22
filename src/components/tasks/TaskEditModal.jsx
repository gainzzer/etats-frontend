export default function TaskEditModal({ editing, setEditing, employees, onSubmit, onClose }) {
  if (!editing) return null;

  const safeEmployees = Array.isArray(employees) ? employees : [];

  function handleChange(e) {
    try {
      const { name, value } = e.target;
      setEditing((p) => ({ ...p, [name]: value }));
    } catch (err) {
      alert(err?.message || "Failed to update");
    }
  }

  function toggleEmployee(id) {
    try {
      const sid = String(id);
      setEditing((p) => {
        const list = Array.isArray(p?.employeeIds) ? p.employeeIds.map(String) : [];
        return {
          ...p,
          employeeIds: list.includes(sid) ? list.filter((x) => x !== sid) : [...list, sid],
        };
      });
    } catch (err) {
      alert(err?.message || "Failed to update employees");
    }
  }

  function handleClose() {
    try {
      onClose?.();
    } catch (err) {
      alert(err?.message || "Failed to close");
    }
  }

  function handleSubmit(e) {
    try {
      onSubmit?.(e);
    } catch (err) {
      e?.preventDefault?.();
      alert(err?.message || "Failed to save");
    }
  }

  const selectedIds = Array.isArray(editing.employeeIds) ? editing.employeeIds.map(String) : [];

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h4>Edit Task</h4>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            name="title"
            value={editing.title ?? ""}
            onChange={handleChange}
            required
          />

          <textarea
            className="form-control mb-2"
            name="description"
            value={editing.description ?? ""}
            onChange={handleChange}
          />

          <select
            className="form-select mb-2"
            name="priority"
            value={editing.priority ?? "Medium"}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <input
            type="date"
            className="form-control mb-3"
            name="dueDate"
            value={editing.dueDate ?? ""}
            onChange={handleChange}
          />

          <div className="assign-box">
            <div className="assign-title">Update Employees</div>

            {safeEmployees.length === 0 ? (
              <div className="text-muted">No employees found</div>
            ) : (
              safeEmployees.map((e) => {
                const id = e?.employeeId ?? e?.employee_id;
                if (!id) return null;

                const sid = String(id);
                const checked = selectedIds.includes(sid);
                const name = e?.name ?? e?.employeeName ?? e?.employee_name ?? "Employee";

                return (
                  <label key={sid} className="d-flex gap-2 mb-2">
                    <input type="checkbox" checked={checked} onChange={() => toggleEmployee(sid)} />
                    {name} ({sid})
                  </label>
                );
              })
            )}
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
            <button className="btn btn-secondary" type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
