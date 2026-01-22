
export default function TaskForm({ form, employees, onChange, onToggleEmployee, onSubmit, onClear }) {
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const selectedIds = Array.isArray(form?.employeeIds) ? form.employeeIds.map(String) : [];

  function handleSubmit(e) {
    try {
      onSubmit?.(e);
    } catch (err) {
      e?.preventDefault?.();
      alert(err?.message || "Failed to create task");
    }
  }

  function handleChange(e) {
    try {
      onChange?.(e);
    } catch (err) {
      alert(err?.message || "Failed to update");
    }
  }

  function handleClear() {
    try {
      onClear?.();
    } catch (err) {
      alert(err?.message || "Failed to clear");
    }
  }

  function handleToggle(id) {
    try {
      onToggleEmployee?.(id);
    } catch (err) {
      alert(err?.message || "Failed to toggle employee");
    }
  }

  return (
    <form className="tasks-form mb-4" onSubmit={handleSubmit}>
      <h4>Create Task</h4>

      <input
        className="form-control mb-2"
        name="title"
        value={form?.title ?? ""}
        onChange={handleChange}
        placeholder="Task title"
        required
      />

      <textarea
        className="form-control mb-2"
        name="description"
        value={form?.description ?? ""}
        onChange={handleChange}
        placeholder="Description"
      />

      <select
        className="form-select mb-2"
        name="priority"
        value={form?.priority ?? "High"}
        onChange={handleChange}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <input
        className="form-control mb-3"
        type="date"
        name="dueDate"
        value={form?.dueDate ?? ""}
        onChange={handleChange}
      />

      <div className="assign-box">
        <div className="assign-title">Assign Employees </div>

        <div className="assign-list">
          {safeEmployees.length === 0 ? (
            <div className="text-muted">No employees found</div>
          ) : (
            safeEmployees.map((e) => {
              const id = e?.employeeId ?? e?.employee_id;
              if (!id) return null;

              const name = e?.name ?? e?.employeeName ?? e?.employee_name ?? "Employee";
              const sid = String(id);
              const inputId = `assign-${sid}`;
              const checked = selectedIds.includes(sid);

              return (
                <div key={sid} className="assign-row">
                  <input
                    id={inputId}
                    type="checkbox"
                    className="assign-check"
                    checked={checked}
                    onChange={() => handleToggle(sid)}
                  />
                  <label className="assign-label" htmlFor={inputId}>
                    {name} ({sid})
                  </label>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-success" type="submit">
          Create
        </button>
        <button className="btn btn-secondary" type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
}
