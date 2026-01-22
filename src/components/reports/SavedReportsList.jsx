function formatDateTime(value) {
  try {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

export default function SavedReportsList({ reports, taskRows, activeReportId, onSelect }) {
  const list = Array.isArray(reports) ? reports : [];

  function handleSelect(id) {
    try {
      onSelect?.(id);
    } catch (err) {
      alert(err?.message || "Failed to select report");
    }
  }

  function taskTitleById(taskId) {
    try {
      const rows = Array.isArray(taskRows) ? taskRows : [];
      const hit = rows.find((t) => String(t?.taskId ?? t?.task_id ?? t?.id ?? "") === String(taskId));
      return hit?.title || hit?.taskTitle || hit?.task_title || "Task";
    } catch {
      return "Task";
    }
  }

  return (
    <div className="report-card">
      <h3 className="report-card-title">Saved Reports</h3>

      {list.length === 0 ? (
        <div className="report-muted">No reports yet.</div>
      ) : (
        <ul className="report-saved-list">
          {list.map((r, idx) => {
            const reportId = r?.reportId ?? r?.report_id ?? r?.id ?? "";
            const taskId = r?.taskId ?? r?.task_id ?? "";
            const createdAt = r?.createdAt ?? r?.created_at ?? null;

            const reportName = r?.reportName ?? r?.report_name ?? "";
            const taskTitle = r?.taskTitle || r?.task_title || taskTitleById(taskId);

            const isActive = String(activeReportId) === String(reportId);

            const titleLine = reportName
              ? `${reportName} — Task #${taskId} — ${taskTitle}`
              : `Report #${idx + 1} — Task #${taskId} — ${taskTitle}`;

            return (
              <li
                key={`rep-${reportId || idx}`}
                className={`report-saved-item ${isActive ? "active" : ""}`}
                onClick={() => handleSelect(reportId)}
              >
                <div className="report-saved-title">{titleLine}</div>
                <div className="report-saved-meta">{formatDateTime(createdAt)}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
