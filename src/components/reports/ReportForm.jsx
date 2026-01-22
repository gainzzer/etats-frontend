export default function ReportForm({
  tasks,
  selectedTaskId,
  reportName,
  content,
  onSelectTask,
  onChangeReportName,
  onChangeContent,
  onGenerate,
  onSave,
}) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const taskIdOf = (t) => t?.taskId ?? t?.task_id ?? t?.id ?? "";
  const taskTitleOf = (t) => t?.title ?? "Untitled";

  return (
    <div className="card p-3 report-form-card">
      <h4 className="mb-3">Generate Report</h4>

      <label className="form-label">Task</label>
      <select
        className="form-select mb-3"
        value={selectedTaskId || ""}
        onChange={(e) => onSelectTask?.(e.target.value)}
      >
        <option value="">Select a task</option>
        {safeTasks.map((t) => {
          const id = taskIdOf(t);
          return (
            <option key={String(id)} value={String(id)}>
              #{id} - {taskTitleOf(t)}
            </option>
          );
        })}
      </select>

      <label className="form-label">Manager Notes</label>
      <textarea
        className="form-control mb-3"
        rows={5}
        value={content || ""}
        onChange={(e) => onChangeContent?.(e.target.value)}
        placeholder="Write progress / issues / decisions..."
      />

     
      <hr />

      <h5 className="mb-2">Save Report</h5>

      <label className="form-label">Report name</label>
      <input
        className="form-control mb-3"
        value={reportName || ""}
        onChange={(e) => onChangeReportName?.(e.target.value)}
        placeholder="e.g. Task 12 progress report"
      />

      <button className="btn btn-success w-100" type="button" onClick={onSave}>
        Save
      </button>
    </div>
  );
}
