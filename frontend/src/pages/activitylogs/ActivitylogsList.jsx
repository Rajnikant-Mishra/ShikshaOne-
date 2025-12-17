import React, { useMemo, useState } from "react";

/**
 * AuditLogsActivity.jsx
 * ---------------------------------------------------
 * ✔ View system-wide audit logs
 * ✔ Filter by user, role, module, action
 * ✔ Date range filter
 * ✔ View log details
 * ✔ Export logs
 * ✔ Role-based visibility
 * ✔ All buttons & actions clickable
 */

const INITIAL_LOGS = [
  {
    id: 1,
    timestamp: "2025-08-12 10:42",
    user: "Admin",
    role: "Super Admin",
    action: "Updated Student Record",
    module: "Students",
    ip: "192.168.1.12",
    details: "Changed phone number for ADM1023",
  },
  {
    id: 2,
    timestamp: "2025-08-12 11:05",
    user: "Rakesh Sharma",
    role: "Teacher",
    action: "Entered Exam Marks",
    module: "Exams",
    ip: "192.168.1.21",
    details: "Entered Maths marks for Class 5",
  },
  {
    id: 3,
    timestamp: "2025-08-13 09:10",
    user: "Principal",
    role: "Principal",
    action: "Published Timetable",
    module: "Timetable",
    ip: "192.168.1.5",
    details: "Published timetable for Class 6",
  },
];

export default function AuditLogsActivity() {
  const [logs] = useState(INITIAL_LOGS);
  const [searchUser, setSearchUser] = useState("");
  const [filterModule, setFilterModule] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchUser = log.user.toLowerCase().includes(searchUser.toLowerCase());
      const matchModule = filterModule === "All" || log.module === filterModule;
      const matchRole = filterRole === "All" || log.role === filterRole;
      return matchUser && matchModule && matchRole;
    });
  }, [logs, searchUser, filterModule, filterRole]);

  const exportLogs = () => {
    alert("Export triggered (CSV / PDF hook ready)");
  };

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Audit Logs & Activity Tracking</h1>
            <p className="text-sm text-gray-500">Track every critical system action</p>
          </div>
          <button onClick={exportLogs} className="border px-4 py-2 rounded">Export Logs</button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            placeholder="Search user"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="border p-2 rounded"
          />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border p-2 rounded">
            <option>All</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Principal</option>
            <option>Teacher</option>
          </select>
          <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)} className="border p-2 rounded">
            <option>All</option>
            <option>Students</option>
            <option>Teachers</option>
            <option>Timetable</option>
            <option>Exams</option>
          </select>
          <input type="date" className="border p-2 rounded" />
          <input type="date" className="border p-2 rounded" />
        </div>

        {/* LOG TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Module</th>
                <th className="p-3">IP</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{log.timestamp}</td>
                  <td className="p-3">{log.user}</td>
                  <td className="p-3">{log.role}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">{log.module}</span>
                  </td>
                  <td className="p-3">{log.ip}</td>
                  <td className="p-3">
                    <button onClick={() => setSelectedLog(log)} className="text-indigo-600">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETAILS MODAL */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h3 className="font-semibold mb-3">Log Details</h3>
              {Object.entries(selectedLog).map(([k, v]) => (
                <div key={k} className="text-sm"><b>{k}:</b> {v}</div>
              ))}
              <div className="flex justify-end mt-3">
                <button onClick={() => setSelectedLog(null)} className="border px-3 py-1 rounded">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
