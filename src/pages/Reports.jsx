import { useEffect, useState } from "react";
import http from "../services/http.js";

import ReportForm from "../components/reports/ReportForm.jsx";
import TaskInfoCard from "../components/reports/TaskInfoCard.jsx";
import ReportViewer from "../components/reports/ReportViewer.jsx";
import SavedReportsList from "../components/reports/SavedReportsList.jsx";

import "../styles/report.css";

function safeParseUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getErrorMessage(err, fallback) {
  try {
    const msg = err?.response?.data?.message || err?.message || "";
    return String(msg).trim() || fallback;
  } catch {
    return fallback;
  }
}

function getTaskId(row) {
  return row?.taskId ?? row?.task_id ?? row?.id ?? "";
}

function getReportId(row) {
  return row?.reportId ?? row?.report_id ?? row?.id ?? "";
}

function uniqueTaskOptions(taskRows) {
  const map = new Map();
  const list = Array.isArray(taskRows) ? taskRows : [];
  for (const r of list) {
    const taskId = getTaskId(r);
    if (!taskId) continue;
    const key = String(taskId);
    if (!map.has(key)) map.set(key, { taskId, title: r?.title || "Task" });
  }
  return Array.from(map.values());
}

function buildTaskSummary(taskRows, taskId) {
  const list = Array.isArray(taskRows) ? taskRows : [];
  const rows = list.filter((t) => String(getTaskId(t)) === String(taskId));
  if (rows.length === 0) return null;

  const first = rows[0];
  const employeesMap = new Map();

  for (const r of rows) {
    const employeeId = r?.employeeId ?? r?.employee_id ?? "";
    if (!employeeId) continue;
    const employeeName = r?.employeeName || r?.employee_name || "";
    employeesMap.set(String(employeeId), { employeeId, employeeName });
  }

  return {
    taskId: getTaskId(first),
    title: first?.title || "",
    priority: first?.priority || "Medium",
    dueDate: first?.dueDate || first?.due_date || null,
    status: first?.status || "Assigned",
    employees: Array.from(employeesMap.values()),
  };
}

export default function Reports() {
  const user = safeParseUser();

  const role = String(user?.role || "").toLowerCase();
  const isManager = role === "manager";
  const managerId = user?.employeeId ?? user?.employee_id ?? null;

  const [taskRows, setTaskRows] = useState([]);
  const [reports, setReports] = useState([]);

  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [reportName, setReportName] = useState("");
  const [content, setContent] = useState("");

  const [activeReportId, setActiveReportId] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    const res = await http.get("/tasks");
    setTaskRows(Array.isArray(res.data) ? res.data : []);
  }

  async function loadReports(nextActiveId) {
    const res = await http.get("/reports");
    const list = Array.isArray(res.data) ? res.data : [];

    list.sort((a, b) => {
      const da = new Date(a?.createdAt ?? a?.created_at ?? 0).getTime();
      const db = new Date(b?.createdAt ?? b?.created_at ?? 0).getTime();
      return db - da;
    });

    setReports(list);

    if (nextActiveId) {
      setActiveReportId(String(nextActiveId));
      return;
    }

    if (!activeReportId && list.length > 0) {
      setActiveReportId(String(getReportId(list[0])));
    }
  }

  useEffect(() => {
    if (!user || !isManager || !managerId) return;

    (async () => {
      try {
        setError("");
        await loadTasks();
        await loadReports("");
      } catch (e) {
        setError(getErrorMessage(e, "Failed to load reports"));
      }
    })();

  }, []);

  if (!user) return <div className="report-page">Please login first.</div>;
  if (!isManager) return <div className="report-page">Manager only.</div>;
  if (!managerId) return <div className="report-page">Missing manager employeeId.</div>;

  const taskOptions = uniqueTaskOptions(taskRows);
  const selectedTaskInfo = selectedTaskId ? buildTaskSummary(taskRows, selectedTaskId) : null;

  const activeReport =
    reports.find((r) => String(getReportId(r)) === String(activeReportId)) || null;

  async function handleGeneratePreview() {
    try {
      setError("");

      if (!selectedTaskId) return setError("Select a task first");
      if (!String(content || "").trim()) return setError("Write manager notes first");

    } catch (e) {
      setError(getErrorMessage(e, "Failed to generate preview"));
    }
  }

  async function handleSave() {
    try {
      setError("");

      if (!selectedTaskId) return setError("Select a task first");
      if (!String(content || "").trim()) return setError("Write manager notes first");

      const payload = {
        taskId: selectedTaskId,
        managerId,
        content: String(content || "").trim(),
        reportName: String(reportName || "").trim(),
      };

      const res = await http.post("/reports", payload);
      const saved = res?.data || null;
      const savedId = getReportId(saved);

      if (!savedId) return setError("Report saved but response missing reportId");

      setReports((prev) => [saved, ...(Array.isArray(prev) ? prev : [])]);
      setActiveReportId(String(savedId));

      setSelectedTaskId("");
      setReportName("");
      setContent("");

      await loadReports(savedId);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to save report"));
    }
  }

  function handleSelectReport(id) {
    setActiveReportId(String(id || ""));
  }

  async function handleRefresh() {
    try {
      setError("");
      await loadTasks();
      await loadReports(activeReportId);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to refresh"));
    }
  }

  return (
    <div className="report-page">
      <div className="report-header">
        

        <button className="report-refresh" type="button" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="report-grid">
        <div className="report-left">
          <ReportForm
            tasks={taskOptions}
            selectedTaskId={selectedTaskId}
            reportName={reportName}
            content={content}
            onSelectTask={setSelectedTaskId}
            onChangeReportName={setReportName}
            onChangeContent={setContent}
            onGenerate={handleGeneratePreview}
            onSave={handleSave}
          />

          <SavedReportsList
            reports={reports}
            taskRows={taskRows}
            activeReportId={activeReportId}
            onSelect={handleSelectReport}
          />
        </div>

        <div className="report-right">
          <TaskInfoCard task={selectedTaskInfo} />
          <ReportViewer report={activeReport} taskRows={taskRows} />
        </div>
      </div>
    </div>
  );
}
