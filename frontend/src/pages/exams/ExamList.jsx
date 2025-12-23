import React, { useState, useEffect } from "react";
import { Button, Checkbox, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "../../components/ui/use-toast";

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

export default function UsersList() {
  const queryClient = useQueryClient();

  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Checkbox selection state
  const [selectAll, setSelectAll] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState(new Set());

  // Delete confirmation dialog (now using Shadcn style)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users
  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["users", page, limit, debouncedSearch, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(status && { status }),
      });

      const res = await axios.get(
        `${API_BASE_URL}/api/v1/users/a?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = response?.users || [];
  const totalUsers = response?.totalUsers || 0;
  const totalPages = response?.totalPages || 1;
  const currentPage = response?.currentPage || 1;

  // Reset selections when data changes
  useEffect(() => {
    setCheckedStudents(new Set());
    setSelectAll(false);
  }, [users]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`${API_BASE_URL}/api/v1/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: `User "${userToDelete?.username}" deleted successfully!`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to delete user",
      });
    },
    onSettled: () => {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
  });

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setCheckedStudents(new Set(users.map((u) => u.id)));
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
    setSelectAll(newChecked.size === users.length && users.length > 0);
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
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
              Exam Management
            </h2>
            <p className="text-sm text-gray-500">Manage system exams</p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button
              component={Link}
              to="/exam/create"
              className={styles.primaryBtn}
              variant="contained"
            >
              + Add Exam
            </Button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className={`${styles.borderedBox} bg-white p-4 mb-4 w-full`}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input
              type="text"
              className={`${styles.field} col-span-5 md:col-span-3`}
              placeholder="Search exam / term / class / subject / status"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              className={styles.field}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Classes</option>
              <option value="class-1">class-1</option>
              <option value="class-2">class-2</option>
            </select>

            <select
              className={styles.field}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Subjects</option>
              <option value="math">math</option>
              <option value="science">science</option>
            </select>

            <select
              className={styles.field}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div
          className={`${styles.borderedBox} bg-white overflow-x-auto w-full`}
        >
          {isLoading && !response ? (
            <div className="p-8 text-center text-gray-600">
              Loading users...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-600">
              Error: {error?.message || "Failed to load users"}
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">
                    <Checkbox
                      size="small"
                      checked={selectAll}
                      indeterminate={checkedStudents.size > 0 && !selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-3">Exam</th>
                  <th className="p-3">Class </th>
                  <th className="p-3">Term</th>
                  <th className="p-3">Subjects</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        size="small"
                        checked={checkedStudents.has(user.id)}
                        onChange={() => handleRowCheck(user.id)}
                      />
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      {user.username}
                    </td>
                    <td className="p-3 font-medium">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role_name || "Unknown"}</td>
                    <td className="p-3">
                      <span className={styles.status}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-4 items-center text-sm">
                        <Link to={`/user/edit/${user.id}`}>
                          <button className="text-gray-600 hover:underline">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(user)}
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

          {isFetching && response && (
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
              {Math.min(page * limit, totalUsers)} of {totalUsers} users
            </div>
            <div className="flex gap-1 mt-2 md:mt-0">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={styles.pageBtn}
              >
                «
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageBtn}
              >
                ‹
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={
                      currentPage === pageNum
                        ? styles.pageBtnActive
                        : styles.pageBtn
                    }
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={styles.pageBtn}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
              >
                ›
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Shadcn/UI Style Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {userToDelete && (
            <div className="py-6 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {userToDelete.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{userToDelete.username}</p>
                <p className="text-sm text-muted-foreground">
                  {userToDelete.email}
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
