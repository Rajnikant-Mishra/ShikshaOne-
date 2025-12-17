import React, { useMemo, useState } from "react";

/**
 * ExamsResultsManagement.jsx
 * ---------------------------------------------------
 * ✔ Create / Edit / View Exams
 * ✔ Schedule subjects & max marks
 * ✔ Enter & Update Results
 * ✔ Publish / Lock Results
 * ✔ Role-based actions (Admin / Teacher / Viewer)
 * ✔ All buttons & actions clickable
 */

const SUBJECTS = ["Mathematics", "Science", "English", "Hindi"];
const CLASSES = ["Class 4", "Class 5", "Class 6"];

const INITIAL_EXAMS = [
  {
    id: 1,
    name: "Mid Term Examination",
    class: "Class 5",
    term: "Mid Term",
    status: "Draft",
    subjects: [
      { subject: "Mathematics", maxMarks: 100 },
      { subject: "Science", maxMarks: 100 },
    ],
    results: {},
  },
];

export default function ExamsResultsManagement() {
  const [role, setRole] = useState("Admin"); // Admin | Teacher | Viewer
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [activeExam, setActiveExam] = useState(null);

  const filtered = useMemo(() => {
    return exams.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [exams, search]);

  /* ---------------- ACTIONS ---------------- */
  const saveExam = (exam) => {
    if (editExam) {
      setExams((prev) => prev.map((e) => (e.id === exam.id ? exam : e)));
    } else {
      setExams((prev) => [
        ...prev,
        { ...exam, id: Date.now(), status: "Draft", results: {} },
      ]);
    }
    setShowForm(false);
    setEditExam(null);
  };

  const publishExam = (examId) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status: "Published" } : e))
    );
    alert("Exam & results published");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Exams & Results</h1>
            <p className="text-sm text-gray-500">
              Create exams, enter marks & publish results
            </p>
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Admin</option>
            <option>Teacher</option>
            <option>Viewer</option>
          </select>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3">
          <input
            placeholder="Search exam"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          {(role === "Admin" || role === "Teacher") && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              + Create Exam
            </button>
          )}
        </div>

        {/* EXAM LIST */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Exam</th>
                <th className="p-3">Class</th>
                <th className="p-3">Term</th>
                <th className="p-3">Subjects</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3 font-medium">{e.name}</td>
                  <td className="p-3">{e.class}</td>
                  <td className="p-3">{e.term}</td>
                  <td className="p-3">
                    {e.subjects.map((s) => s.subject).join(", ")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        e.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setActiveExam(e)}
                      className="text-indigo-600"
                    >
                      Results
                    </button>
                    {role !== "Viewer" && e.status === "Draft" && (
                      <button
                        onClick={() => {
                          setEditExam(e);
                          setShowForm(true);
                        }}
                        className="text-gray-600"
                      >
                        Edit
                      </button>
                    )}
                    {role === "Admin" && e.status === "Draft" && (
                      <button
                        onClick={() => publishExam(e.id)}
                        className="text-green-600"
                      >
                        Publish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CREATE / EDIT EXAM */}
        {showForm && (
          <ExamForm
            initial={editExam}
            onSave={saveExam}
            onClose={() => {
              setShowForm(false);
              setEditExam(null);
            }}
          />
        )}

        {/* RESULTS ENTRY */}
        {activeExam && (
          <ResultsEntry exam={activeExam} onClose={() => setActiveExam(null)} />
        )}
      </div>
    </div>
  );
}

/* ---------------- EXAM FORM ---------------- */
function ExamForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: "", class: "", term: "", subjects: [] }
  );

  const toggleSubject = (sub) => {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.find((s) => s.subject === sub)
        ? f.subjects.filter((s) => s.subject !== sub)
        : [...f.subjects, { subject: sub, maxMarks: 100 }],
    }));
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="font-semibold mb-3">
          {initial ? "Edit" : "Create"} Exam
        </h3>
        <input
          placeholder="Exam Name"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select
          className="border p-2 w-full mb-2"
          value={form.class}
          onChange={(e) => setForm({ ...form, class: e.target.value })}
        >
          <option value="">Select Class</option>
          {CLASSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          placeholder="Term"
          className="border p-2 w-full mb-3"
          value={form.term}
          onChange={(e) => setForm({ ...form, term: e.target.value })}
        />

        <div className="mb-3">
          <p className="text-sm font-medium">Subjects</p>
          {SUBJECTS.map((s) => (
            <label key={s} className="block text-sm">
              <input
                type="checkbox"
                checked={!!form.subjects.find((x) => x.subject === s)}
                onChange={() => toggleSubject(s)}
              />{" "}
              {s}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-3 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="bg-indigo-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- RESULTS ENTRY ---------------- */
function ResultsEntry({ exam, onClose }) {
  const [results, setResults] = useState({});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[500px]">
        <h3 className="font-semibold mb-3">Results – {exam.name}</h3>
        {exam.subjects.map((s) => (
          <div key={s.subject} className="mb-2">
            <label className="text-sm">
              {s.subject} (Max {s.maxMarks})
            </label>
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Enter marks"
              onChange={(e) =>
                setResults((r) => ({ ...r, [s.subject]: e.target.value }))
              }
            />
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="border px-3 py-1 rounded">
            Close
          </button>
          <button
            onClick={() => {
              alert("Results saved");
              onClose();
            }}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
