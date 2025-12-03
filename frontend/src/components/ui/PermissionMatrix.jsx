import React, { useEffect, useState } from "react";
 
const PermissionMatrix = ({ role }) => {
  const permissionMatrixHeading = [
    "Module",
    "View",
    "Edit",
    "Create",
    "Delete",
    "Manage",
  ];
  const permissionCategory = ["view", "edit", "create", "delete", "manage"];
 
  const defaultPermissions = [
    {
      module: "Dashboard",
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
    {
      module: "Students",
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
    {
      module: "Teachers",
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
    {
      module: "Attendance",
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
    {
      module: "Exam",
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
    {
      module: "Fee",
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
    {
      module: "Transport",
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
  ];
 
  // Load permissions from localStorage for the given role
  const getPermissionsForRole = (role) => {
    const stored = localStorage.getItem("permissions");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[role] || defaultPermissions;
    }
    return defaultPermissions;
  };
 
  const [permissions, setPermissions] = useState(getPermissionsForRole(role));
 
  useEffect(() => {
    setPermissions(getPermissionsForRole(role));
  }, [role]);
 
  const togglePermission = (rowIndex, perm) => {
    const updated = permissions.map((row, idx) =>
      idx === rowIndex ? { ...row, [perm]: !row[perm] } : row
    );
    setPermissions(updated);
 
    // Save updated permissions to localStorage per role
    const stored = JSON.parse(localStorage.getItem("permissions") || "{}");
    stored[role] = updated;
    localStorage.setItem("permissions", JSON.stringify(stored));
  };
 
  return (
    <div className="md:col-span-2 border rounded-lg overflow-hidden">
      <div className="border-b p-3 font-medium flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
        <span>{role ? `${role} - ` : ""}Permissions Matrix</span>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted sticky top-0">
              {permissionMatrixHeading.map((text) => (
                <th
                  key={text}
                  className={`p-3 font-medium ${
                    text === "Module" ? "text-left" : "text-center"
                  }`}
                >
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((row, rowIndex) => (
              <tr key={row.module} className="border-t">
                <td className="p-3">{row.module}</td>
                {permissionCategory.map((perm) => (
                  <td key={perm} className="text-center p-3">
                    <div
                      className={`h-5 w-5 rounded border flex items-center justify-center mx-auto cursor-pointer ${
                        row[perm]
                          ? "bg-primary text-white border-primary"
                          : "bg-white"
                      }`}
                      onClick={() => togglePermission(rowIndex, perm)}
                    >
                      {row[perm] ? "✓" : ""}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default PermissionMatrix;