export default function RecentTasksCard({ title, tasks, formatDate }) {
  const list = Array.isArray(tasks) ? tasks : [];

  function safeFormat(value) {
    try {
      return formatDate ? formatDate(value) : "-";
    } catch {
      return "-";
    }
  }

  return (
    <div className="dash-card dash-wide">
      <div className="dash-card-title">{title}</div>

      {list.length === 0 ? (
        <div className="dash-empty">No tasks yet</div>
      ) : (
        <div className="dash-table">
          <div className="dash-row dash-row-head">
            <div>Task</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Due</div>
          </div>

          {list.map((t) => (
            <div key={`rec-${t.taskId}`} className="dash-row">
              <div className="dash-cell-title">
                <div className="dash-cell-strong">{t.title}</div>
                <div className="dash-cell-muted">Task ID: #{t.taskId}</div>
              </div>
              <div>{t.status}</div>
              <div>{t.priority}</div>
              <div>{safeFormat(t.dueDate)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
