import React, { useMemo, useState } from "react";

/**
 * TeacherManagementFull.jsx
 * ---------------------------------------------------
 * ✔ Add / Edit / View Teacher
 * ✔ Search & Filters
 * ✔ Bulk Actions
 * ✔ Role-based access (Admin / Viewer)
 * ✔ All buttons clickable & working
 * ✔ API-ready structure
 */

const INITIAL_TEACHERS = [
  {
    id: 1,
    name: "Rakesh Sharma",
    empId: "EMP-101",
    phone: "9876543210",
    email: "rakesh@school.com",
    subjects: ["Mathematics"],
    classes: ["5A", "6B"],
    status: "Active",
  },
  {
    id: 2,
    name: "Anita Patel",
    empId: "EMP-102",
    phone: "9123456780",
    email: "anita@school.com",
    subjects: ["English"],
    classes: ["4A"],
    status: "Active",
  },
];

const SUBJECTS = ["Mathematics", "Science", "English", "Hindi", "Computer"];
const CLASSES = ["1A", "2A", "3B", "4A", "5A", "6B"];

export default function TeacherManagementFull() {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState([]);
  const [role, setRole] = useState("Admin");

  const [showAdd, setShowAdd] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [viewTeacher, setViewTeacher] = useState(null);

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch = `${t.name} ${t.empId} ${t.phone}`.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [teachers, search, filterStatus]);

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  /* ---------------- ACTIONS ---------------- */
  const saveTeacher = (teacher) => {
    if (editTeacher) {
      setTeachers((prev) => prev.map((t) => t.id === teacher.id ? teacher : t));
    } else {
      setTeachers((prev) => [...prev, { ...teacher, id: Date.now() }]);
    }
    setShowAdd(false);
    setEditTeacher(null);
  };

  const bulkDeactivate = () => {
    if (role !== "Admin") return alert("Permission denied");
    setTeachers((prev) => prev.map((t) => selected.includes(t.id) ? { ...t, status: "Inactive" } : t));
    setSelected([]);
  };

  const bulkActivate = () => {
    if (role !== "Admin") return alert("Permission denied");
    setTeachers((prev) => prev.map((t) => selected.includes(t.id) ? { ...t, status: "Active" } : t));
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Teacher Management</h1>
            <p className="text-sm text-gray-500">Manage teachers, subjects & classes</p>
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded">
            <option>Admin</option>
            <option>Viewer</option>
          </select>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name / emp / phone" className="border rounded p-2" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          {role === "Admin" && (
            <button onClick={() => setShowAdd(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">+ Add Teacher</button>
          )}
        </div>

        {/* BULK BAR */}
        {selected.length > 0 && (
          <div className="bg-indigo-50 border p-3 rounded mb-4 flex justify-between">
            <span>{selected.length} selected</span>
            <div className="flex gap-2">
              <button onClick={bulkActivate} className="border px-3 py-1 rounded">Activate</button>
              <button onClick={bulkDeactivate} className="border px-3 py-1 rounded">Deactivate</button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3"></th>
                <th className="p-3">Teacher</th>
                <th className="p-3">Employee ID</th>
                <th className="p-3">Subjects</th>
                <th className="p-3">Classes</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3"><input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleSelect(t.id)} /></td>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3">{t.empId}</td>
                  <td className="p-3">{t.subjects.join(", ")}</td>
                  <td className="p-3">{t.classes.join(", ")}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${t.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200"}`}>{t.status}</span></td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => setViewTeacher(t)} className="text-indigo-600">View</button>
                    {role === "Admin" && <button onClick={() => { setEditTeacher(t); setShowAdd(true); }} className="text-gray-600">Edit</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD / EDIT MODAL */}
        {showAdd && <TeacherForm initial={editTeacher} onSave={saveTeacher} onClose={() => { setShowAdd(false); setEditTeacher(null); }} />}

        {/* VIEW MODAL */}
        {viewTeacher && <ViewTeacher teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}

      </div>
    </div>
  );
}

/* ---------------- FORM MODAL ---------------- */
function TeacherForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: "", empId: "", phone: "", email: "", subjects: [], classes: [], status: "Active" });

  const toggle = (key, value) => {
    setForm((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="font-semibold mb-3">{initial ? "Edit" : "Add"} Teacher</h3>
        <input placeholder="Name" className="border p-2 w-full mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Employee ID" className="border p-2 w-full mb-2" value={form.empId} onChange={(e) => setForm({ ...form, empId: e.target.value })} />
        <input placeholder="Phone" className="border p-2 w-full mb-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" className="border p-2 w-full mb-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <div className="mb-3">
          <p className="text-sm font-medium">Subjects</p>
          {SUBJECTS.map((s) => (
            <label key={s} className="block text-sm"><input type="checkbox" checked={form.subjects.includes(s)} onChange={() => toggle("subjects", s)} /> {s}</label>
          ))}
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium">Classes</p>
          {CLASSES.map((c) => (
            <label key={c} className="block text-sm"><input type="checkbox" checked={form.classes.includes(c)} onChange={() => toggle("classes", c)} /> {c}</label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-3 py-1 rounded">Cancel</button>
          <button onClick={() => onSave(form)} className="bg-indigo-600 text-white px-4 py-1 rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- VIEW MODAL ---------------- */
function ViewTeacher({ teacher, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="font-semibold mb-3">Teacher Profile</h3>
        {Object.entries(teacher).map(([k, v]) => (
          <div key={k} className="text-sm"><b>{k}:</b> {Array.isArray(v) ? v.join(", ") : v}</div>
        ))}
        <div className="flex justify-end mt-3">
          <button onClick={onClose} className="border px-3 py-1 rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
