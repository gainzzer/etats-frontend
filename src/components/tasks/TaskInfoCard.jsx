function formatDate(d) {
    if (!d) return "-";
    return String(d).slice(0, 10);
  }
  
  export default function TaskInfoCard({ task }) {
    const t = task || null;
  
    const taskId = t?.taskId ?? t?.task_id ?? null;
    const title = t?.title ?? "";
    const status = t?.status ?? "";
    const priority = t?.priority ?? "";
    const dueDate = t?.dueDate ?? t?.due_date ?? null;
  
    const employees = Array.isArray(t?.employees) ? t.employees : [];
  
    return (
      <div className="report-card">
        <h3 className="report-card-title">Task Information</h3>
  
        {!t ? (
          <div className="report-muted">Select a task to view details.</div>
        ) : (
          <>
            <div className="report-kv">
              <span>Task ID</span>
              <b>#{taskId ?? "-"}</b>
            </div>
  
            <div className="report-kv">
              <span>Title</span>
              <b>{title || "-"}</b>
            </div>
  
            <div className="report-kv">
              <span>Status</span>
              <b>{status || "-"}</b>
            </div>
  
            <div className="report-kv">
              <span>Priority</span>
              <b>{priority || "-"}</b>
            </div>
  
            <div className="report-kv">
              <span>Due Date</span>
              <b>{formatDate(dueDate)}</b>
            </div>
  
            <div className="report-section">
              <div className="report-section-title">Assigned Employees</div>
  
              {employees.length === 0 ? (
                <div className="report-muted">No employees assigned.</div>
              ) : (
                <ul className="report-list">
                  {employees.map((e) => (
                    <li
                      key={`emp-${taskId}-${e.employeeId ?? e.employee_id ?? "x"}`}
                      className="report-list-item"
                    >
                      {e.employeeId ?? e.employee_id ?? "-"}{" "}
                      {e.employeeName || e.employee_name ? `(${e.employeeName || e.employee_name})` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
  