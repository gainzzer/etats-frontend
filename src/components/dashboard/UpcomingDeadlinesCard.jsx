export default function UpcomingDeadlinesCard({ upcoming, formatDate }) {
  const list = Array.isArray(upcoming) ? upcoming : [];

  function safeFormat(value) {
    try {
      return formatDate ? formatDate(value) : "-";
    } catch {
      return "-";
    }
  }

  return (
    <div className="dash-card">
      <div className="dash-card-title">Upcoming Deadlines</div>

      {list.length === 0 ? (
        <div className="dash-empty">No due dates yet</div>
      ) : (
        <ul className="dash-list">
          {list.map((t) => (
            <li key={`up-${t.taskId}`} className="dash-list-item">
              <div className="dash-li-left">
                <div className="dash-li-title">{t.title}</div>
                <div className="dash-li-meta">
                  Priority: {t.priority} • Status: {t.status}
                </div>
              </div>
              <div className="dash-li-right">{safeFormat(t.dueDate)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
