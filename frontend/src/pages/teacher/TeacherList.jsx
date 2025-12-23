
// import React, { useState } from "react";
// import { Button, Checkbox, CircularProgress } from "@mui/material";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
// import styles from "../common-css/TableList.module.css";

// const fetchClasses = async () => {
//   const { data } = await axios.get(`${API_BASE_URL}/api/student-class/`);
//   return Array.isArray(data) ? data : data?.results || data?.data || [];
// };

// const fetchSubjects = async () => {
//   const { data } = await axios.get(`${API_BASE_URL}/api/subjects/`);
//   return Array.isArray(data) ? data : data?.results || data?.data || [];
// };

// // Updated to match your backend response format
// const fetchTeachers = async ({ queryKey }) => {
//   const [_key, { page = 1, limit = 10, search = "" }] = queryKey;
//   const { data } = await axios.get(`${API_BASE_URL}/api/teacher/`, {
//     params: { page, limit, search },
//   });

//   if (!data.success) {
//     throw new Error(data.error || "Failed to fetch teachers");
//   }

//   return {
//     teachers: data.data, // array of teachers
//     pagination: data.pagination,
//   };
// };

// export default function TeacherManagement() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [selectedSubject, setSelectedSubject] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const [selectAll, setSelectAll] = useState(false);
//   const [checkedTeachers, setCheckedTeachers] = useState(new Set());

//   // Fetch supporting data
//   const { data: classes = [], isLoading: classesLoading } = useQuery({
//     queryKey: ["classes"],
//     queryFn: fetchClasses,
//   });

//   const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
//     queryKey: ["subjects"],
//     queryFn: fetchSubjects,
//   });

//   // Fetch teachers with pagination + search
//   const {
//     data: teacherData,
//     isLoading: teachersLoading,
//     error: teachersError,
//   } = useQuery({
//     queryKey: ["teachers", { page, limit, search: searchQuery }],
//     queryFn: fetchTeachers,
//     keepPreviousData: true, // smooth pagination
//   });

//   const teachers = teacherData?.teachers || [];
//   const pagination = teacherData?.pagination || {};

//   const isLoading = classesLoading || subjectsLoading || teachersLoading;

//   // Handle checkbox logic
//   const handleSelectAll = (checked) => {
//     setSelectAll(checked);
//     if (checked) {
//       setCheckedTeachers(new Set(teachers.map((t) => t.id)));
//     } else {
//       setCheckedTeachers(new Set());
//     }
//   };

//   const handleRowCheck = (id) => {
//     const newChecked = new Set(checkedTeachers);
//     if (newChecked.has(id)) newChecked.delete(id);
//     else newChecked.add(id);
//     setCheckedTeachers(newChecked);
//     setSelectAll(newChecked.size === teachers.length && teachers.length > 0);
//   };

//   // Client-side filtering for Class, Subject, Status (since backend doesn't support yet)
//   const filteredTeachers = teachers.filter((teacher) => {
//     const matchesClass =
//       selectedClass === "all" ||
//       (teacher.classes || []).includes(parseInt(selectedClass));

//     const matchesSubject =
//       selectedSubject === "all" ||
//       (teacher.subjects || []).includes(parseInt(selectedSubject));

//     const matchesStatus =
//       selectedStatus === "all" || teacher.status === selectedStatus;

//     return matchesClass && matchesSubject && matchesStatus;
//   });

//   return (
//     <div className={styles.Screen}>
//       <div className="mx-auto w-full">
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
//           <div>
//             <h2 className="text-3xl font-bold tracking-tight">
//               Teacher Management
//             </h2>
//             <p className="text-sm text-gray-500">
//               Manage teachers, subjects & classes
//             </p>
//           </div>
//           <div className="flex gap-2 mt-3 md:mt-0">
//             <Button
//               component={Link}
//               to="/teacher/add"
//               className={styles.primaryBtn}
//               variant="contained"
//             >
//               + Add Teacher
//             </Button>
//           </div>
//         </div>

//         {/* FILTER BAR */}
//         <div className={`${styles.borderedBox} bg-white p-4 mb-4 w-full`}>
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//             <input
//               type="text"
//               className={`${styles.field} col-span-5 md:col-span-5`}
//               placeholder="Search by name, emp ID, email, phone"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setPage(1); // reset to page 1 on search
//               }}
//             />

//             <select
//               className={styles.field}
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
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
//                   <Checkbox
//                     size="small"
//                     checked={selectAll}
//                     onChange={(e) => handleSelectAll(e.target.checked)}
//                   />
//                 </th>
//                 <th className="p-3">Teacher</th>
//                 <th className="p-3">Employee ID</th>
//                 <th className="p-3">email</th>
//                 <th className="p-3">Joining Date</th>

//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTeachers.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="p-8 text-center text-gray-500">
//                     No teachers found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredTeachers.map((teacher) => (
//                   <tr key={teacher.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">
//                       <Checkbox
//                         size="small"
//                         checked={checkedTeachers.has(teacher.id)}
//                         onChange={() => handleRowCheck(teacher.id)}
//                       />
//                     </td>
//                     <td className="p-3 flex items-center gap-3">
//                       <div>
//                         <div className="font-medium">{teacher.name}</div>
//                       </div>
//                     </td>
//                     <td className="p-3">{teacher.emp_id || "-"}</td>
//                     <td className="p-3">{teacher.email || "-"}</td>
//                     <td className="p-3">{teacher.joining_date || "-"}</td>
//                     <td className="p-3">{teacher.phone || "-"}</td>
//                     <td className="p-3">
//                       <span className={styles.status}>{teacher.status}</span>
//                     </td>
//                     <td className="p-3">
//                       <div className="flex gap-4 items-center text-sm">
//                         <Link to={`/teacher/edit/${teacher.id}`}>
//                           <button className="text-gray-600 hover:underline">
//                             Edit
//                           </button>
//                         </Link>
//                         <button
//                           onClick={() => {
//                             if (
//                               window.confirm(`Delete teacher ${teacher.name}?`)
//                             ) {
//                               // TODO: Add actual delete API call + refetch
//                               alert("Delete API not implemented yet");
//                             }
//                           }}
//                           className="text-red-600 hover:underline"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6">
//           <div className="text-sm text-gray-600">
//             Showing {(page - 1) * limit + 1}–
//             {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
//             Teachers
//           </div>
//           <div className="flex gap-1 mt-2 md:mt-0">
//             <button
//               onClick={() => setPage(1)}
//               disabled={page === 1}
//               className={styles.pageBtn}
//             >
//               «
//             </button>
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className={styles.pageBtn}
//             >
//               ‹
//             </button>

//             {/* Simple page numbers */}
//             {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
//               <button
//                 key={i + 1}
//                 onClick={() => setPage(i + 1)}
//                 className={
//                   page === i + 1 ? styles.pageBtnActive : styles.pageBtn
//                 }
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               onClick={() =>
//                 setPage((p) => Math.min(pagination.totalPages || 1, p + 1))
//               }
//               disabled={page === pagination.totalPages}
//               className={styles.pageBtn}
//             >
//               ›
//             </button>
//             <button
//               onClick={() => setPage(pagination.totalPages || 1)}
//               disabled={page === pagination.totalPages}
//               className={styles.pageBtn}
//             >
//               »
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Button, Checkbox, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "../../components/ui/use-toast"; // ← This is the toast package used

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"; // Shadcn Dialog
import { Avatar, AvatarFallback } from "../../components/ui/avatar"; // Shadcn Avatar

import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
import styles from "../common-css/TableList.module.css";

const fetchClasses = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/student-class/`);
  return Array.isArray(data) ? data : data?.results || data?.data || [];
};

const fetchSubjects = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/subjects/`);
  return Array.isArray(data) ? data : data?.results || data?.data || [];
};

const fetchTeachers = async ({ queryKey }) => {
  const [_key, { page = 1, limit = 10, search = "" }] = queryKey;
  const { data } = await axios.get(`${API_BASE_URL}/api/teacher/`, {
    params: { page, limit, search },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch teachers");
  }

  return {
    teachers: data.data,
    pagination: data.pagination,
  };
};

export default function TeacherManagement() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectAll, setSelectAll] = useState(false);
  const [checkedTeachers, setCheckedTeachers] = useState(new Set());

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch supporting data
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  // Fetch teachers
  const {
    data: teacherData,
    isLoading: teachersLoading,
    isFetching,
  } = useQuery({
    queryKey: ["teachers", { page, limit, search: debouncedSearch }],
    queryFn: fetchTeachers,
    keepPreviousData: true,
  });

  const teachers = teacherData?.teachers || [];
  const pagination = teacherData?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalTeachers = pagination.total || 0;

  const isLoading = classesLoading || subjectsLoading || teachersLoading;

  // Reset selections when data changes
  useEffect(() => {
    setCheckedTeachers(new Set());
    setSelectAll(false);
  }, [teachers]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (teacherId) => {
      await axios.delete(`${API_BASE_URL}/api/teacher/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({
        title: "Success",
        description: `Teacher "${teacherToDelete?.name}" deleted successfully!`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to delete teacher",
      });
    },
    onSettled: () => {
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);
    },
  });

  // Checkbox handlers
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setCheckedTeachers(new Set(teachers.map((t) => t.id)));
    } else {
      setCheckedTeachers(new Set());
    }
  };

  const handleRowCheck = (id) => {
    const newChecked = new Set(checkedTeachers);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedTeachers(newChecked);
    setSelectAll(newChecked.size === teachers.length && teachers.length > 0);
  };

  // Client-side filtering
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesClass =
      selectedClass === "all" ||
      (teacher.classes || []).includes(parseInt(selectedClass));
    const matchesSubject =
      selectedSubject === "all" ||
      (teacher.subjects || []).includes(parseInt(selectedSubject));
    const matchesStatus =
      selectedStatus === "all" || teacher.status === selectedStatus;

    return matchesClass && matchesSubject && matchesStatus;
  });

  const openDeleteDialog = (teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteMutation.mutate(teacherToDelete.id);
    }
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className={styles.Screen}>
      <div className="mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Teacher Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage teachers, subjects & classes
            </p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button
              component={Link}
              to="/teacher/add"
              className={styles.primaryBtn}
              variant="contained"
            >
              + Add Teacher
            </Button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className={`${styles.borderedBox} bg-white p-4 mb-4 w-full`}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input
              type="text"
              className={`${styles.field} col-span-5 md:col-span-5`}
              placeholder="Search by name, emp ID, email, phone"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <select
              className={styles.field}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className={`${styles.borderedBox} bg-white overflow-x-auto w-full`}>
          {isLoading && !teacherData ? (
            <div className="p-8 text-center text-gray-600">Loading teachers...</div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No teachers found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">
                    <Checkbox
                      size="small"
                      checked={selectAll}
                      indeterminate={checkedTeachers.size > 0 && !selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-3">Teacher</th>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Joining Date</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        size="small"
                        checked={checkedTeachers.has(teacher.id)}
                        onChange={() => handleRowCheck(teacher.id)}
                      />
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {teacher.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{teacher.name}</div>
                    </td>
                    <td className="p-3">{teacher.emp_id || "-"}</td>
                    <td className="p-3">{teacher.email || "-"}</td>
                    <td className="p-3">{teacher.joining_date || "-"}</td>
                    <td className="p-3">{teacher.phone || "-"}</td>
                    <td className="p-3">
                      <span className={styles.status}>{teacher.status}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-4 items-center text-sm">
                        <Link to={`/teacher/edit/${teacher.id}`}>
                          <button className="text-gray-600 hover:underline">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(teacher)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isFetching && teacherData && (
            <div className="p-4 text-center text-sm text-gray-500">
              Updating...
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalTeachers)} of {totalTeachers} teachers
            </div>
            <div className="flex gap-1 mt-2 md:mt-0">
              <button onClick={() => goToPage(1)} disabled={page === 1} className={styles.pageBtn}>«</button>
              <button onClick={() => goToPage(page - 1)} disabled={page === 1} className={styles.pageBtn}>‹</button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={page === pageNum ? styles.pageBtnActive : styles.pageBtn}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button onClick={() => goToPage(totalPages)} className={styles.pageBtn}>
                    {totalPages}
                  </button>
                </>
              )}

              <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className={styles.pageBtn}>›</button>
              <button onClick={() => goToPage(totalPages)} disabled={page === totalPages} className={styles.pageBtn}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* Shadcn Delete Confirmation Dialog - EXACT SAME AS UsersList */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this teacher? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {teacherToDelete && (
            <div className="py-6 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {teacherToDelete.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{teacherToDelete.name}</p>
                <p className="text-sm text-muted-foreground">
                  {teacherToDelete.email || "No email"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <CircularProgress size={20} className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}