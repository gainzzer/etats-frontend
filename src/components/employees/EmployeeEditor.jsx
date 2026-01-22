export default function EmployeeEditor({ selected, form, onChange, onAdd, onUpdate, onClear }) {
  function handleAdd() {
    try {
      const res = onAdd?.();
      if (res && typeof res.catch === "function") {
        res.catch((e) => alert(e?.message || "Failed to add employee"));
      }
    } catch (err) {
      alert(err?.message || "Failed to add employee");
    }
  }

  function handleUpdate() {
    try {
      const res = onUpdate?.();
      if (res && typeof res.catch === "function") {
        res.catch((e) => alert(e?.message || "Failed to update employee"));
      }
    } catch (err) {
      alert(err?.message || "Failed to update employee");
    }
  }

  function handleClear() {
    try {
      onClear?.();
    } catch (err) {
      alert(err?.message || "Failed to clear form");
    }
  }

  return (
    <div className="employees-card">
      <h4 className="employees-card-title">{selected ? "Edit Employee" : "Add Employee"}</h4>

      <div>
        <input
          className="form-control mb-2"
          name="employeeId"
          value={form.employeeId}
          onChange={onChange}
          placeholder="Employee ID"
          disabled={!!selected}
        />

        <input
          className="form-control mb-2"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Name"
        />

        <input
          className="form-control mb-2"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
        />

        <input
          className="form-control mb-2"
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="Phone"
        />

        <input
          className="form-control mb-2"
          name="department"
          value={form.department}
          onChange={onChange}
          placeholder="Department"
        />

        <input
          className="form-control mb-2"
          name="designation"
          value={form.designation}
          onChange={onChange}
          placeholder="Designation"
        />

        <input
          className="form-control mb-2"
          name="photoUrl"
          value={form.photoUrl}
          onChange={onChange}
          placeholder="Photo URL"
        />

        <div className="row g-2">
          <div className="col-6">
            <select className="form-select mb-2" name="role" value={form.role} onChange={onChange}>
              <option value="employee">employee</option>
              <option value="manager">manager</option>
            </select>
          </div>

          <div className="col-6">
            <select className="form-select mb-2" name="status" value={form.status} onChange={onChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <input
          className="form-control mb-2"
          type="date"
          name="hireDate"
          value={form.hireDate}
          onChange={onChange}
        />

        <input
          className="form-control mb-3"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder={selected ? "New password (optional)" : "Password (required)"}
        />

        <div className="d-flex gap-2">
          {!selected ? (
            <button className="btn btn-success" type="button" onClick={handleAdd}>
              Add
            </button>
          ) : (
            <button className="btn btn-success" type="button" onClick={handleUpdate}>
              Update
            </button>
          )}

          <button className="btn btn-secondary" type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
