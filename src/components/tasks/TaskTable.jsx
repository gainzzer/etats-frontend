export default function TaskTable({ tasks, isManager, onEdit, onDelete, onStatusChange }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  function getDescription(t) {
    try {
      const d = t?.description ?? t?.taskDescription ?? t?.task_description ?? t?.desc ?? "";
      return String(d || "").trim();
    } catch {
      return "";
    }
  }

  function pillClass(prefix, value) {
    try {
      return `${prefix}-${String(value || "").toLowerCase().replace(/\s+/g, "-")}`;
    } catch {
      return `${prefix}-unknown`;
    }
  }

  function handleEdit(t) {
    try {
      onEdit?.(t);
    } catch (err) {
      alert(err?.message || "Failed to open edit");
    }
  }

  function handleDelete(id) {
    try {
      onDelete?.(id);
    } catch (err) {
      alert(err?.message || "Failed to delete");
    }
  }

  function handleStatus(taskId, value) {
    try {
      onStatusChange?.(taskId, value);
    } catch (err) {
      alert(err?.message || "Failed to update status");
    }
  }

  return (
    <div className="tasks-table-card">
      <div className="tasks-table-header">
        <h4 className="tasks-table-title">{isManager ? "All Tasks" : "My Tasks"}</h4>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle tasks-table">
          <thead>
            <tr>
              <th className="col-title">Task</th>
              <th className="col-employee">{isManager ? "Assigned To" : "Employee"}</th>
              <th className="col-status">Status</th>
              <th className="col-priority">Priority</th>
              <th className="col-due">Due</th>
              {isManager && <th className="col-actions text-end">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {safeTasks.map((t) => {
              const key = String(t.taskId);
              const due = t.dueDate ? String(t.dueDate).slice(0, 10) : "-";
              const desc = getDescription(t);

              return (
                <tr key={key} className="task-row">
                  <td className="task-main">
                    <div className="task-title-row">
                      <div className="task-title">{t.title}</div>
                      <div className="task-id">#{t.taskId}</div>
                    </div>

                    <div className="task-desc">
                      {desc ? desc : <span className="task-desc-empty">No description</span>}
                    </div>
                  </td>

                  <td>
                    {isManager ? (
                      <div className="assignees">
                        {Array.isArray(t.assignees) && t.assignees.length > 0 ? (
                          t.assignees.map((a) => (
                            <span key={a.employeeId} className="assignee-pill">
                              {a.employeeName} <span className="assignee-id">({a.employeeId})</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </div>
                    ) : (
                      <span>{t.employeeName || "-"}</span>
                    )}
                  </td>

                  <td>
                    {!isManager ? (
                      <select
                        className="form-select form-select-sm"
                        value={t.status || "Pending"}
                        onChange={(e) => handleStatus(t.taskId, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    ) : (
                      <span className={`status-pill ${pillClass("status", t.status)}`}>{t.status}</span>
                    )}
                  </td>

                  <td>
                    <span className={`priority-pill ${pillClass("priority", t.priority)}`}>{t.priority}</span>
                  </td>

                  <td className="task-due">{due}</td>

                  {isManager && (
                    <td className="text-end">
                      <div className="task-actions">
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => handleEdit(t)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          onClick={() => handleDelete(t.taskId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {safeTasks.length === 0 && (
              <tr>
                <td colSpan={isManager ? 6 : 5} className="text-muted">
                  No tasks yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
