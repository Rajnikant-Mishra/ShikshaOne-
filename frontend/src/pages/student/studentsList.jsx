
// import React from "react";
// import { Button, Checkbox } from "@mui/material";
// import { Link } from "react-router-dom";

// import styles from "./StudentsList.module.css";

// export default function StudentsList() {
//   return (
//     // <div className="min-h-screen  text-gray-800 p-4">
//     <div className={styles.Screen}>
//       <div className=" mx-auto w-full">
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
//           <div>
//             <h2 className="text-3xl font-bold tracking-tight">Students</h2>
//             <p className="text-sm text-gray-500">Academic Year: 2025–26</p>
//           </div>
//           <div className="flex gap-2 mt-3 md:mt-0">
//             <Button component={Link} to="/students/add" className={styles.primaryBtn} variant="contained">
//               + Add Student
//             </Button>
//             <Button className={styles.primaryBtn} variant="outlined">
//               Import
//             </Button>
//             <Button className={styles.primaryBtn} variant="outlined">
//               Export
//             </Button>
//           </div>
//         </div>

//         {/* FILTER BAR */}
//         <div className={`${styles.borderedBox} bg-white p-4 mb-4 w-full`}>
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//             <select className={styles.field}>
//               <option>All Classes</option>
//               <option>Class 1</option>
//               <option>Class 2</option>
//             </select>
//             <select className={styles.field}>
//               <option>All Sections</option>
//               <option>A</option>
//               <option>B</option>
//             </select>
//             <select className={styles.field}>
//               <option>Status</option>
//               <option>Active</option>
//               <option>Inactive</option>
//             </select>
//             <select className={styles.field}>
//               <option>Tags</option>
//               <option>Transport</option>
//               <option>Scholarship</option>
//             </select>
//             <input
//               className={`${styles.field} col-span-2`}
//               placeholder="Search name / admission / phone"
//             />
//           </div>
//         </div>

//         {/* TABLE */}
//         <div
//           className={`${styles.borderedBox} bg-white overflow-x-auto w-full`}
//         >
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr className="text-left">
//                 <th className="p-3">
//                   <Checkbox size="small" />
//                 </th>
//                 <th className="p-3">Student</th>
//                 <th className="p-3">Adm No</th>
//                 <th className="p-3">Class</th>
//                 <th className="p-3">Roll</th>
//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Tags</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-t hover:bg-gray-50">
//                 <td className="p-3">
//                   <Checkbox size="small" />
//                 </td>
//                 <td className="p-3 flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-gray-300" />
//                   <div>
//                     <div className="font-medium">Aarav Mishra</div>
//                     <div className="text-xs text-gray-500">Section A</div>
//                   </div>
//                 </td>
//                 <td className="p-3">ADM1023</td>
//                 <td className="p-3">Class 5</td>
//                 <td className="p-3">12</td>
//                 <td className="p-3">9876543210</td>
//                 <td className="p-3">
//                   <span className={styles.tag}>Transport</span>
//                 </td>
//                 <td className="p-3">
//                   <span className={styles.status}>Active</span>
//                 </td>
//                 <td className="p-3">
//                   <button className={styles.link}>View</button>
//                 </td>
//               </tr>
//               <tr className="border-t hover:bg-gray-50">
//                 <td className="p-3">
//                   <Checkbox size="small" />
//                 </td>
//                 <td className="p-3 flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-gray-300" />
//                   <div>
//                     <div className="font-medium">Aarav Mishra</div>
//                     <div className="text-xs text-gray-500">Section A</div>
//                   </div>
//                 </td>
//                 <td className="p-3">ADM1023</td>
//                 <td className="p-3">Class 5</td>
//                 <td className="p-3">12</td>
//                 <td className="p-3">9876543210</td>
//                 <td className="p-3">
//                   <span className={styles.tag}>Transport</span>
//                 </td>
//                 <td className="p-3">
//                   <span className={styles.status}>Active</span>
//                 </td>
//                 <td className="p-3">
//                   <button className={styles.link}>View</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6">
//           <div className="text-sm text-gray-600">
//             Showing 1–10 of 3,482 students
//           </div>
//           <div className="flex gap-1 mt-2 md:mt-0">
//             <button className={styles.pageBtn}>«</button>
//             <button className={styles.pageBtn}>‹</button>
//             <button className={styles.pageBtnActive}>1</button>
//             <button className={styles.pageBtn}>2</button>
//             <button className={styles.pageBtn}>3</button>
//             <button className={styles.pageBtn}>›</button>
//             <button className={styles.pageBtn}>»</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import {
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import styles from "../common-css/TableList.module.css";

export default function StudentsList() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Mishra",
      section: "A",
      admNo: "ADM1023",
      className: "Class 5",
      roll: "12",
      phone: "9876543210",
      tags: ["Transport"],
      status: "Active",
      materials: ["Notebook", "Pen Set", "Geometry Box"],
    },
    {
      id: 2,
      name: "Priya Sharma",
      section: "B",
      admNo: "ADM1024",
      className: "Class 5",
      roll: "15",
      phone: "8765432109",
      tags: ["Scholarship"],
      status: "Active",
      materials: ["Textbook", "Pencil Case"],
    },
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState(new Set());

  // For menu: track which row's menu is open and its anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuOpen = (event, studentId) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(studentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleDelete = (student) => {
    if (window.confirm(`Delete student ${student.name}?`)) {
      setStudents(students.filter((s) => s.id !== student.id));
    }
    handleMenuClose();
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setCheckedStudents(new Set(students.map((s) => s.id)));
    } else {
      setCheckedStudents(new Set());
    }
  };

  const handleRowCheck = (id) => {
    const newChecked = new Set(checkedStudents);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedStudents(newChecked);
    setSelectAll(newChecked.size === students.length);
  };

  return (
    <div className={styles.Screen}>
      <div className="mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Students</h2>
            <p className="text-sm text-gray-500">Academic Year: 2025–26</p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button component={Link} to="/students/add" className={styles.primaryBtn} variant="contained">
              + Add Student
            </Button>
            <Button className={styles.primaryBtn} variant="outlined">Import</Button>
            <Button className={styles.primaryBtn} variant="outlined">Export</Button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className={`${styles.borderedBox} bg-white p-4 mb-4 w-full`}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <select className={styles.field}><option>All Classes</option></select>
            <select className={styles.field}><option>All Sections</option></select>
            <select className={styles.field}><option>Status</option></select>
            <select className={styles.field}><option>Tags</option></select>
            <input className={`${styles.field} col-span-2`} placeholder="Search name / admission / phone" />
          </div>
        </div>

        {/* TABLE */}
        <div className={`${styles.borderedBox} bg-white overflow-x-auto w-full`}>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">
                  <Checkbox
                    size="small"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-3">Student</th>
                <th className="p-3">Adm No</th>
                <th className="p-3">Class</th>
                <th className="p-3">Roll</th>
                <th className="p-3">Phone</th>
                
                <th className="p-3">Tags</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      size="small"
                      checked={checkedStudents.has(student.id)}
                      onChange={() => handleRowCheck(student.id)}
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-gray-500">Section {student.section}</div>
                    </div>
                  </td>
                  <td className="p-3">{student.admNo}</td>
                  <td className="p-3">{student.className}</td>
                  <td className="p-3">{student.roll}</td>
                  <td className="p-3">{student.phone}</td>
                
                  <td className="p-3">
                    {student.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </td>
                  <td className="p-3">
                    <span className={styles.status}>{student.status}</span>
                  </td>
                  <td className="p-3">
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, student.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuId === student.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem component={Link} to={`/students/view/${student.id}`} onClick={handleMenuClose}>
                        View
                      </MenuItem>
                      <MenuItem component={Link} to={`/students/edit/${student.id}`} onClick={handleMenuClose}>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(student)} sx={{ color: "error.main" }}>
                        Delete
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6">
          <div className="text-sm text-gray-600">Showing 1–10 of 3,482 students</div>
          <div className="flex gap-1 mt-2 md:mt-0">
            <button className={styles.pageBtn}>«</button>
            <button className={styles.pageBtn}>‹</button>
            <button className={styles.pageBtnActive}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <button className={styles.pageBtn}>›</button>
            <button className={styles.pageBtn}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
}