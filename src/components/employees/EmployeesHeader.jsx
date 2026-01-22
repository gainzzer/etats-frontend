export default function EmployeesHeader({ onNew, onRefresh }) {
  function handleNew() {
    try {
      onNew?.();
    } catch (err) {
      alert(err?.message || "Failed to open new employee form");
    }
  }

  function handleRefresh() {
    try {
      const res = onRefresh?.();
      if (res && typeof res.catch === "function") {
        res.catch((e) => alert(e?.message || "Failed to refresh employees"));
      }
    } catch (err) {
      alert(err?.message || "Failed to refresh employees");
    }
  }

  return (
    <div className="employees-header d-flex justify-content-end">
      <div className="d-flex gap-2">
        <button className="btn btn-outline-light btn-sm" onClick={handleNew} type="button">
          New Employee
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleRefresh} type="button">
          Refresh
        </button>
      </div>
    </div>
  );
}
