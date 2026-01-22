export default function TaskInfoCard({ task }) {
  const title = task?.title || "Untitled Task";
  const taskId = task?.taskId || task?.id || "";
  const priority = task?.priority || "—";
  const status = task?.status || "—";
  const due = task?.dueDate || task?.due_date || "—";
  const description = task?.description || "No description";

  return (
    <div className="report-card task-info">
      <div className="report-card-title">Task Info</div>

      <div className="report-kv">
        <span>Task</span>
        <b>
          {title}
          {taskId ? ` #${taskId}` : ""}
        </b>
      </div>

      <div className="report-kv">
        <span>Priority</span>
        <b>{priority}</b>
      </div>

      <div className="report-kv">
        <span>Status</span>
        <b>{status}</b>
      </div>

      <div className="report-kv">
        <span>Due</span>
        <b>{due || "—"}</b>
      </div>

      <div className="report-section">
        <div className="report-section-title">Description</div>
        <div className="report-content">{description}</div>
      </div>
    </div>
  );
}
