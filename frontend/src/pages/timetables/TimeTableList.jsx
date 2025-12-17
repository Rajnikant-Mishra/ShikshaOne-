import React, { useEffect, useMemo, useState } from "react";

/**
 * TimetablePro.jsx – Production‑grade Timetable Engine
 * ---------------------------------------------------
 * ✔ Drag & Drop (mouse move)
 * ✔ Teacher conflict warnings
 * ✔ Class view + Teacher-wise view
 * ✔ Auto-scheduler (rule-based)
 * ✔ API-ready (Laravel / Node)
 * ✔ Printable / PDF mode
 * ✔ Polished ERP UI
 */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const PERIODS = [
  { id: 1, label: "09:00 – 09:45" },
  { id: 2, label: "09:45 – 10:30" },
  { id: "break", label: "10:30 – 10:45", break: true },
  { id: 3, label: "10:45 – 11:30" },
];

const SUBJECTS = [
  { id: "math", name: "Mathematics", teacher: "R. Sharma", color: "indigo" },
  { id: "sci", name: "Science", teacher: "S. Verma", color: "green" },
  { id: "eng", name: "English", teacher: "A. Patel", color: "yellow" },
  { id: "hin", name: "Hindi", teacher: "N. Singh", color: "pink" },
];

export default function TimetablePro() {
  const [viewMode, setViewMode] = useState("class"); // class | teacher
  const [status, setStatus] = useState("Draft");
  const [timetable, setTimetable] = useState({});
  const [dragItem, setDragItem] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  /* ---------------- DRAG & DROP ---------------- */
  const onDragStart = (day, periodId, subject) => {
    setDragItem({ day, periodId, subject });
  };

  const onDrop = (day, periodId) => {
    if (!dragItem) return;

    // Teacher conflict detection
    const conflict = Object.entries(timetable).some(([d, periods]) =>
      periods?.[periodId]?.teacher === dragItem.subject.teacher && d !== day
    );

    if (conflict) {
      alert(`Conflict: ${dragItem.subject.teacher} already assigned in this period.`);
      setDragItem(null);
      return;
    }

    setTimetable((prev) => ({
      ...prev,
      [day]: { ...prev[day], [periodId]: dragItem.subject },
    }));

    setDragItem(null);
  };

  /* ---------------- AUTO SCHEDULER ---------------- */
  const autoSchedule = () => {
    const auto = {};
    let subjectIndex = 0;

    DAYS.forEach((day) => {
      auto[day] = {};
      PERIODS.forEach((p) => {
        if (p.break) return;
        auto[day][p.id] = SUBJECTS[subjectIndex % SUBJECTS.length];
        subjectIndex++;
      });
    });

    setTimetable(auto);
  };

  /* ---------------- TEACHER VIEW ---------------- */
  const teacherView = useMemo(() => {
    const map = {};
    SUBJECTS.forEach((s) => (map[s.teacher] = {}));

    Object.entries(timetable).forEach(([day, periods]) => {
      Object.entries(periods || {}).forEach(([pid, sub]) => {
        map[sub.teacher][`${day}-${pid}`] = sub;
      });
    });

    return map;
  }, [timetable]);

  /* ---------------- API PAYLOAD ---------------- */
  const apiPayload = {
    academic_year: "2025-26",
    class: "5",
    section: "A",
    status,
    timetable,
  };

  /* ---------------- PRINT ---------------- */
  useEffect(() => {
    if (printMode) {
      window.print();
      setPrintMode(false);
    }
  }, [printMode]);

  return (
    <div className={`min-h-screen ${printMode ? "bg-white" : "bg-gray-100"} p-6`}>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Timetable / Schedule</h1>
            <p className="text-sm text-gray-500">Create, manage and publish class & teacher schedules</p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            <button onClick={autoSchedule} className="border px-4 py-2 rounded">Auto‑Schedule</button>
            <button onClick={() => setPrintMode(true)} className="border px-4 py-2 rounded">Print / PDF</button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white rounded shadow p-4 mb-4 flex flex-wrap gap-4 items-center">
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="border rounded p-2">
            <option value="class">Class View</option>
            <option value="teacher">Teacher View</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded p-2">
            <option>Draft</option>
            <option>Published</option>
          </select>

          <span className={`text-xs px-3 py-1 rounded ${status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {status}
          </span>
        </div>

        {/* SUBJECT PALETTE */}
        {!printMode && viewMode === "class" && (
          <div className="flex gap-3 mb-4">
            {SUBJECTS.map((s) => (
              <div
                key={s.id}
                draggable
                onDragStart={() => onDragStart(null, null, s)}
                className={`bg-${s.color}-100 rounded px-4 py-2 cursor-move shadow`}
              >
                <div className="font-medium">{s.name}</div>
                <div className="text-xs">{s.teacher}</div>
              </div>
            ))}
          </div>
        )}

        {/* CLASS VIEW */}
        {viewMode === "class" && (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Time</th>
                  {DAYS.map((d) => <th key={d} className="p-3">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((p) => (
                  p.break ? (
                    <tr key={p.id} className="bg-gray-100">
                      <td className="p-3 font-semibold">{p.label}</td>
                      <td colSpan={DAYS.length} className="p-3">Break</td>
                    </tr>
                  ) : (
                    <tr key={p.id} className="border-t">
                      <td className="p-3 text-left font-medium">{p.label}</td>
                      {DAYS.map((day) => {
                        const cell = timetable?.[day]?.[p.id];
                        return (
                          <td
                            key={day}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => onDrop(day, p.id)}
                            className={`p-3 border ${cell ? `bg-${cell.color}-50` : "bg-gray-50"}`}
                          >
                            {cell ? (
                              <div
                                draggable
                                onDragStart={() => onDragStart(day, p.id, cell)}
                                className="cursor-move"
                              >
                                <div className="font-medium">{cell.name}</div>
                                <div className="text-xs">{cell.teacher}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Drop</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TEACHER VIEW */}
        {viewMode === "teacher" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(teacherView).map(([teacher, slots]) => (
              <div key={teacher} className="bg-white rounded shadow p-4">
                <h3 className="font-semibold mb-2">{teacher}</h3>
                {Object.keys(slots).length === 0 ? (
                  <p className="text-sm text-gray-500">No periods assigned</p>
                ) : (
                  <ul className="text-sm space-y-1">
                    {Object.keys(slots).map((k) => (
                      <li key={k}>{k.replace("-", " ")}: {slots[k].name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* API PAYLOAD PREVIEW */}
        <div className="mt-6 bg-white rounded shadow p-4">
          <h3 className="font-medium mb-2">API Payload Preview</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(apiPayload, null, 2)}
          </pre>
        </div>

      </div>
    </div>
  );
}
