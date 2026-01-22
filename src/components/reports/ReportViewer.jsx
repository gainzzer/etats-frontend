function getTaskId(row) {
  return row?.taskId ?? row?.task_id ?? row?.id ?? "";
}

function buildTaskTitle(taskRows, taskId) {
  try {
    const list = Array.isArray(taskRows) ? taskRows : [];
    const match = list.find((t) => String(getTaskId(t)) === String(taskId));
    return match?.title || match?.taskTitle || match?.task_title || "Task";
  } catch {
    return "Task";
  }
}

function formatDateTime(value) {
  try {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

export default function ReportViewer({ report, taskRows }) {
  const r = report || null;

  const createdAt = r?.createdAt ?? r?.created_at ?? null;
  const taskId = r?.taskId ?? r?.task_id ?? null;
  const managerId = r?.managerId ?? r?.manager_id ?? null;

  return (
    <div className="report-card">
      <h3 className="report-card-title">Generated Report</h3>

      {!r ? (
        <div className="report-muted">Select a report to preview it here.</div>
      ) : (
        <>
          <div className="report-kv">
            <span>Generated</span>
            <b>{formatDateTime(createdAt)}</b>
          </div>

          <div className="report-section">
            <div className="report-section-title">Report Summary</div>

            <div className="report-summary">
              <div>
                <b>Task:</b> #{taskId} — {buildTaskTitle(taskRows, taskId)}
              </div>
              <div>
                <b>Manager ID:</b> {managerId || "-"}
              </div>
            </div>
          </div>

          <div className="report-section">
            <div className="report-section-title">Manager Notes</div>
            <div className="report-content">{r?.content || "-"}</div>
          </div>
        </>
      )}
    </div>
  );
}
