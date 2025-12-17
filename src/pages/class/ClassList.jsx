import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useToast } from "../../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";

// Yup Validation Schema
const classSchema = yup.object({
  class_name: yup
    .string()
    .required("Class name is required")
    .min(2, "Class name must be at least 2 characters")
    .max(100, "Class name must not exceed 100 characters"),
  status: yup.string().oneOf(["Active", "Inactive"]).default("Active"),
});

const Class = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const limit = 10;

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(classSchema),
    defaultValues: {
      class_name: "",
      status: "Active",
    },
  });

  // Fetch Classes with React Query
  const {
    data: classesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["classes", { searchTerm, page }],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/student-class/`, {
        params: { search: searchTerm, page, limit },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const classes = classesData?.data || [];
  const pagination = classesData?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) =>
      axios.post(`${API_BASE_URL}/api/student-class/`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Class created successfully" });
      reset();
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setPage(1);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to add class",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_BASE_URL}/api/student-class/${id}`),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Class deleted successfully" });
      setIsDeleteDialogOpen(false);
      setClassToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      if (classes.length === 1 && page > 1) setPage(page - 1);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete class",
      });
    },
  });

  // Handlers
  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleDeleteConfirm = () => {
    if (classToDelete) deleteMutation.mutate(classToDelete.id);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Class</h2>
          <p className="text-muted-foreground">Manage class and status</p>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => reset()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>
                Enter details of the new class.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="class_name" className="font-medium text-sm">
                    Class Name
                  </label>
                  <Input
                    id="class_name"
                    placeholder="Enter class name"
                    {...register("class_name")}
                  />
                  {errors.class_name && (
                    <p className="text-sm text-destructive">
                      {errors.class_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="font-medium text-sm">
                    Status
                  </label>
                  <Select
                    value={watch("status")}
                    onValueChange={(value) => setValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Class"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search class..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Loading & Empty State */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-6 bg-muted rounded w-20"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-full"></div>
                  <div className="h-6 bg-muted rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Search className="h-6 w-6 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No classes found</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Badge
                  className={
                    cls.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }
                >
                  {cls.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setClassToDelete(cls);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{cls.class_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{cls.class_name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {classToDelete && (
            <div className="py-4 flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {classToDelete.class_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium">{classToDelete.class_name}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Class;
