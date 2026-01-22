export default function QuickStatsCard({ stats, isManager, employeesCount }) {
  const s = stats || { total: 0, assigned: 0, inProgress: 0, completed: 0 };

  return (
    <div className="dash-card">
      <div className="dash-card-title">Quick Stats</div>

      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-label">Total Tasks</div>
          <div className="dash-stat-value">{s.total}</div>
        </div>

        <div className="dash-stat">
          <div className="dash-stat-label">Assigned</div>
          <div className="dash-stat-value">{s.assigned}</div>
        </div>

        <div className="dash-stat">
          <div className="dash-stat-label">In Progress</div>
          <div className="dash-stat-value">{s.inProgress}</div>
        </div>

        <div className="dash-stat">
          <div className="dash-stat-label">Completed</div>
          <div className="dash-stat-value">{s.completed}</div>
        </div>

        {isManager ? (
          <div className="dash-stat">
            <div className="dash-stat-label">Employees</div>
            <div className="dash-stat-value">{employeesCount || 0}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
