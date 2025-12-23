
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Search, Plus, Trash2, MoreHorizontal } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Card, CardContent, CardHeader } from "../../components/ui/card";
// import { Avatar, AvatarFallback } from "../../components/ui/avatar";
// import { Badge } from "../../components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import { useToast } from "../../components/ui/use-toast";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";

// // Validation Schema
// const subjectSchema = yup.object({
//   subject_name: yup
//     .string()
//     .required("Subject name is required")
//     .min(2, "Subject name must be at least 2 characters")
//     .max(100, "Subject name must not exceed 100 characters")
//     .trim(),
//   status: yup.string().oneOf(["Active", "Inactive"]).default("Active"),
// });

// const Subject = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [subjectToDelete, setSubjectToDelete] = useState(null);

//   const queryClient = useQueryClient();
//   const { toast } = useToast();
//   const limit = 10;

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(subjectSchema),
//     defaultValues: {
//       subject_name: "",
//       status: "Active",
//     },
//   });

//   // Fetch Subjects
//   const {
//     data: subjectsData,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["subjects", searchTerm, page],
//     queryFn: async () => {
//       const res = await axios.get(`${API_BASE_URL}/api/subjects/`, {
//         params: { search: searchTerm, page, limit },
//       });
//       return res.data;
//     },
//     keepPreviousData: true,
//     staleTime: 1000 * 30, // 30 seconds
//   });

//   const subjects = subjectsData?.data || [];
//   const pagination = subjectsData?.pagination || {};
//   const totalPages = pagination.totalPages || 1;

//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: (data) => axios.post(`${API_BASE_URL}/api/subjects/`, data),
//     onSuccess: () => {
//       toast({ title: "Success", description: "Subject created successfully" });
//       reset();
//       setIsAddDialogOpen(false);
//       queryClient.invalidateQueries({ queryKey: ["subjects"] });
//       setPage(1);
//     },
//     onError: (error) => {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.response?.data?.error || "Failed to create subject",
//       });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => axios.delete(`${API_BASE_URL}/api/subjects/${id}/`),
//     onSuccess: () => {
//       toast({ title: "Deleted", description: "Subject deleted successfully" });
//       setIsDeleteDialogOpen(false);
//       setSubjectToDelete(null);
//       queryClient.invalidateQueries({ queryKey: ["subjects"] });

//       // Go to previous page if current page becomes empty
//       if (subjects.length === 1 && page > 1) {
//         setPage((p) => p - 1);
//       }
//     },
//     onError: () => {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to delete subject",
//       });
//     },
//   });

//   // Handlers
//   const onSubmit = (data) => {
//     createMutation.mutate(data);
//   };

//   const openDeleteDialog = (subject) => {
//     setSubjectToDelete(subject);
//     setIsDeleteDialogOpen(true);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setPage(1);
//   };

//   return (
//     <div className="space-y-6 p-1">
//       {/* Header */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
//           <p className="text-muted-foreground">Manage your school subjects and their status</p>
//         </div>

//         {/* Add Subject Dialog */}
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => reset()}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Subject
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Add New Subject</DialogTitle>
//               <DialogDescription>
//                 Create a new subject for your institution.
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid gap-5 py-4">
//                 <div className="space-y-2">
//                   <label htmlFor="subject_name" className="text-sm font-medium">
//                     Subject Name
//                   </label>
//                   <Input
//                     id="subject_name"
//                     placeholder="e.g., Mathematics, Science"
//                     {...register("subject_name")}
//                   />
//                   {errors.subject_name && (
//                     <p className="text-sm text-destructive">{errors.subject_name.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label htmlFor="status" className="text-sm font-medium">
//                     Status
//                   </label>
//                   <Select
//                     value={watch("status")}
//                     onValueChange={(value) => setValue("status", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Active">Active</SelectItem>
//                       <SelectItem value="Inactive">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     reset();
//                     setIsAddDialogOpen(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={createMutation.isPending}>
//                   {createMutation.isPending ? "Adding..." : "Add Subject"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           type="search"
//           placeholder="Search subjects..."
//           className="pl-10"
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>

//       {/* Loading State */}
//       {isLoading ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {[...Array(6)].map((_, i) => (
//             <Card key={i} className="animate-pulse">
//               <CardHeader>
//                 <div className="h-6 w-20 bg-muted rounded"></div>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-4">
//                   <div className="h-16 w-16 bg-muted rounded-full"></div>
//                   <div className="space-y-2">
//                     <div className="h-5 bg-muted rounded w-32"></div>
//                     <div className="h-4 bg-muted rounded w-24"></div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : subjects.length === 0 ? (
//         <Card className="border-dashed">
//           <CardContent className="flex flex-col items-center justify-center py-16">
//             <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
//               <Search className="h-8 w-8 text-muted-foreground" />
//             </div>
//             <p className="text-lg text-muted-foreground">No subjects found</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Try adjusting your search or add a new subject.
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//         >
//           {subjects.map((subject) => (
//             <Card key={subject.id} className="hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <Badge
//                   variant="secondary"
//                   className={
//                     subject.status === "Active"
//                       ? "bg-green-100 text-green-700 hover:bg-green-200"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }
//                 >
//                   {subject.status}
//                 </Badge>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreHorizontal className="h-4 w-4" />
//                       <span className="sr-only">Open menu</span>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem
//                       className="text-destructive focus:text-destructive"
//                       onSelect={() => openDeleteDialog(subject)}
//                     >
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       Delete Subject
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-4">
//                   <Avatar className="h-16 w-16">
//                     <AvatarFallback className="text-lg font-bold bg-primary/10">
//                       {subject.subject_name.charAt(0).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h3 className="font-semibold text-lg">{subject.subject_name}</h3>
//                     <p className="text-sm text-muted-foreground">Subject</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </motion.div>
//       )}

//       {/* Pagination */}
//       {!isLoading && totalPages > 1 && (
//         <div className="flex items-center justify-center gap-3 mt-10">
//           <Button
//             variant="outline"
//             disabled={page <= 1}
//             onClick={() => setPage(page - 1)}
//           >
//             Previous
//           </Button>
//           <span className="text-sm text-muted-foreground">
//             Page {page} of {totalPages}
//           </span>
//           <Button
//             variant="outline"
//             disabled={page >= totalPages}
//             onClick={() => setPage(page + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Subject</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this subject? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           {subjectToDelete && (
//             <div className="flex items-center gap-4 py-4">
//               <Avatar>
//                 <AvatarFallback className="bg-primary/10">
//                   {subjectToDelete.subject_name.charAt(0).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-semibold text-lg">{subjectToDelete.subject_name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   Status: <Badge variant="outline">{subjectToDelete.status}</Badge>
//                 </p>
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsDeleteDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => deleteMutation.mutate(subjectToDelete.id)}
//               disabled={deleteMutation.isPending}
//             >
//               {deleteMutation.isPending ? "Deleting..." : "Delete Subject"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Subject;


import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, MoreHorizontal, Edit } from "lucide-react";
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

// Validation Schema
const subjectSchema = yup.object({
  subject_name: yup
    .string()
    .required("Subject name is required")
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name must not exceed 100 characters")
    .trim(),
  status: yup.string().oneOf(["Active", "Inactive"]).default("Active"),
});

const Subject = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [subjectToEdit, setSubjectToEdit] = useState(null); // For editing

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const limit = 10;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: {
      subject_name: "",
      status: "Active",
    },
  });

  // Fetch Subjects
  const {
    data: subjectsData,
    isLoading,
  } = useQuery({
    queryKey: ["subjects", searchTerm, page],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/subjects/`, {
        params: { search: searchTerm, page, limit },
      });
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });

  const subjects = subjectsData?.data || [];
  const pagination = subjectsData?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => axios.post(`${API_BASE_URL}/api/subjects/`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Subject created successfully" });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setPage(1);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to create subject",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      axios.put(`${API_BASE_URL}/api/subjects/${id}/`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Subject updated successfully" });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to update subject",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_BASE_URL}/api/subjects/${id}/`),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Subject deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSubjectToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      if (subjects.length === 1 && page > 1) {
        setPage((p) => p - 1);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete subject",
      });
    },
  });

  // Shared reset function
  const resetForm = () => {
    reset();
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSubjectToEdit(null);
  };

  // Unified submit handler (create or update)
  const onSubmit = (data) => {
    if (subjectToEdit) {
      updateMutation.mutate({ id: subjectToEdit.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Edit handler
  const handleEdit = (subject) => {
    setSubjectToEdit(subject);
    setValue("subject_name", subject.subject_name);
    setValue("status", subject.status);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (subject) => {
    setSubjectToDelete(subject);
    setIsDeleteDialogOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
          <p className="text-muted-foreground">Manage your school subjects and their status</p>
        </div>

        {/* Add Subject Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { reset(); setSubjectToEdit(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Create a new subject for your institution.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5 py-4">
                <div className="space-y-2">
                  <label htmlFor="subject_name" className="text-sm font-medium">
                    Subject Name
                  </label>
                  <Input
                    id="subject_name"
                    placeholder="e.g., Mathematics, Science"
                    {...register("subject_name")}
                  />
                  {errors.subject_name && (
                    <p className="text-sm text-destructive">{errors.subject_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
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
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Subject"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search subjects..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Loading & Empty State */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">No subjects found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or add a new subject.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <Badge
                  variant="secondary"
                  className={
                    subject.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                >
                  {subject.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(subject)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Subject
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => openDeleteDialog(subject)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Subject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg font-bold bg-primary/10">
                      {subject.subject_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{subject.subject_name}</h3>
                    <p className="text-sm text-muted-foreground">Subject</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
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

      {/* Edit Dialog - Reuses the same form */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the subject name and status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 py-4">
              <div className="space-y-2">
                <label htmlFor="subject_name_edit" className="text-sm font-medium">
                  Subject Name
                </label>
                <Input
                  id="subject_name_edit"
                  placeholder="e.g., Mathematics, Science"
                  {...register("subject_name")}
                />
                {errors.subject_name && (
                  <p className="text-sm text-destructive">{errors.subject_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="status_edit" className="text-sm font-medium">
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
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subject</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subject? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {subjectToDelete && (
            <div className="flex items-center gap-4 py-4">
              <Avatar>
                <AvatarFallback className="bg-primary/10">
                  {subjectToDelete.subject_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{subjectToDelete.subject_name}</p>
                <p className="text-sm text-muted-foreground">
                  Status: <Badge variant="outline">{subjectToDelete.status}</Badge>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(subjectToDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subject;