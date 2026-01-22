export default function DashboardHeader({ title, subtitle, onRefresh }) {
  function handleRefresh() {
    try {
      const res = onRefresh?.();
      if (res && typeof res.catch === "function") {
        res.catch((e) => alert(e?.message || "Failed to refresh"));
      }
    } catch (err) {
      alert(err?.message || "Failed to refresh");
    }
  }

  return (
    <div className="dash-header">
      <div>
        <div className="dash-title">{title}</div>
        <div className="dash-subtitle">{subtitle}</div>
      </div>

      <button className="dash-refresh" type="button" onClick={handleRefresh}>
        Refresh
      </button>
    </div>
  );
}
