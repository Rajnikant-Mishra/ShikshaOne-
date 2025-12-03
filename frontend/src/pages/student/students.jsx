
// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   Search,
//   Plus,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Upload,
//   Copy,
//   User,
//   X,
// } from "lucide-react";

// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";
// import { Card, CardContent, CardHeader } from "../../components/ui/card";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../components/ui/avatar";
// import { Badge } from "../../components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../../components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { useToast } from "../../components/ui/use-toast";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";

// // Validation Schema
// const studentSchema = yup.object({
//   first_name: yup.string().required("First name is required").trim(),
//   last_name: yup.string().required("Last name is required").trim(),
//   date_of_birth: yup.date().required("Date of birth is required").nullable(),
//   gender: yup
//     .string()
//     .oneOf(["Male", "Female", "Other"])
//     .required("Gender is required"),
//   student_class: yup.string().required("Class is required"),
//   admission_date: yup.date().required("Admission date is required").nullable(),
//   parent_name: yup.string().required("Parent name is required").trim(),
//   parent_email: yup
//     .string()
//     .email("Invalid email")
//     .required("Parent email is required"),
//   parent_mobile: yup
//     .string()
//     .matches(/^\d{10}$/, "Must be exactly 10 digits")
//     .required("Mobile number is required"),
//   address: yup.string().optional(),
//   student_image: yup.mixed().nullable(),
// });

// const Students = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   // Fetch Classes & Students
//   const { data: classes = [], isLoading: classesLoading } = useQuery({
//     queryKey: ["classes"],
//     queryFn: async () => {
//       const res = await axios.get(`${API_BASE_URL}/api/student-class/`);
//       return res.data.data || [];
//     },
//   });

//   const { data: students = [], isLoading: studentsLoading } = useQuery({
//     queryKey: ["students"],
//     queryFn: async () => {
//       const res = await axios.get(`${API_BASE_URL}/api/students/`);
//       return res.data.data || [];
//     },
//   });

//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: (formData) =>
//       axios.post(`${API_BASE_URL}/api/students/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["students"] });
//       toast({ title: "Success", description: "Student added successfully!" });
//       closeDialog();
//     },
//     onError: (err) =>
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.response?.data?.error || "Failed to add student",
//       }),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, formData }) =>
//       axios.put(`${API_BASE_URL}/api/students/${id}/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["students"] });
//       toast({ title: "Updated", description: "Student updated successfully!" });
//       closeDialog();
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => axios.delete(`${API_BASE_URL}/api/students/${id}/`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["students"] });
//       toast({ title: "Deleted", description: "Student removed successfully!" });
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(studentSchema),
//   });

//   const watchedImage = watch("student_image");

//   useEffect(() => {
//     if (watchedImage?.[0]) {
//       const url = URL.createObjectURL(watchedImage[0]);
//       setPreviewImage(url);
//       return () => URL.revokeObjectURL(url);
//     } else if (!watchedImage && !isEditMode) {
//       setPreviewImage(null);
//     }
//   }, [watchedImage, isEditMode]);

//   const closeDialog = () => {
//     setIsDialogOpen(false);
//     reset();
//     setPreviewImage(null);
//     setIsEditMode(false);
//     setEditingStudent(null);
//   };

//   const openAddDialog = () => {
//     closeDialog();
//     setIsDialogOpen(true);
//   };

//   const handleEdit = (student) => {
//     setEditingStudent(student);
//     setIsEditMode(true);
//     setIsDialogOpen(true);

//     const fields = [
//       "first_name",
//       "last_name",
//       "date_of_birth",
//       "gender",
//       "student_class",
//       "admission_date",
//       "parent_name",
//       "parent_email",
//       "parent_mobile",
//       "address",
//     ];
//     fields.forEach((field) => setValue(field, student[field] || ""));

//     if (student.student_image) {
//       setPreviewImage(`${API_BASE_URL}/uploads/${student.student_image}`);
//     }
//   };

//   const onSubmit = (data) => {
//     const formData = new FormData();

//     if (
//       isEditMode &&
//       editingStudent?.student_image &&
//       !data.student_image?.[0]
//     ) {
//       formData.append("existing_image", editingStudent.student_image);
//     } else if (data.student_image?.[0]) {
//       formData.append("student_image", data.student_image[0]);
//     }

//     Object.entries(data).forEach(([key, value]) => {
//       if (key !== "student_image" && value != null) {
//         formData.append(key, value);
//       }
//     });

//     if (isEditMode) {
//       updateMutation.mutate({ id: editingStudent.id, formData });
//     } else {
//       createMutation.mutate(formData);
//     }
//   };

//   const resetFilters = () => {
//     setSelectedGrade("");
//     setSelectedSection("");
//     setSelectedStatus("");
//     setSearchTerm("");
//   };

//   // Filter Logic
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch =
//       `${student.first_name} ${student.last_name}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.roll_number?.toString().includes(searchTerm);

//     const matchesGrade =
//       !selectedGrade || student.student_class?.includes(selectedGrade);
//     const matchesSection =
//       !selectedSection || student.section === selectedSection;
//     const matchesStatus = !selectedStatus || student.status === selectedStatus;

//     return matchesSearch && matchesGrade && matchesSection && matchesStatus;
//   });

//   return (
//     <div className="container mx-auto p-6 space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-4xl font-bold tracking-tight">Students</h1>
//           <p className="text-muted-foreground">
//             Manage student records with ease
//           </p>
//         </div>
//         <Button onClick={openAddDialog} size="lg">
//           <Plus className="mr-2 h-5 w-5" /> Add Student
//         </Button>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-col gap-4 md:flex-row">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search by name, ID, or roll number..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="flex gap-2">
//           <Select value={selectedGrade} onValueChange={setSelectedGrade}>
//             <SelectTrigger className="w-[130px]">
//               <SelectValue placeholder="Grade" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Grades</SelectItem>
//               {classes.map((cls) => (
//                 <SelectItem key={cls.id} value={cls.class_name.split(" ")[1]}>
//                   {cls.class_name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={selectedSection} onValueChange={setSelectedSection}>
//             <SelectTrigger className="w-[130px]">
//               <SelectValue placeholder="Section" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Sections</SelectItem>
//               {["A", "B", "C"].map((s) => (
//                 <SelectItem key={s} value={s}>
//                   Section {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//             <SelectTrigger className="w-[130px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Status</SelectItem>
//               <SelectItem value="Active">Active</SelectItem>
//               <SelectItem value="Inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button variant="ghost" size="icon" onClick={resetFilters}>
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {studentsLoading ? (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {[...Array(8)].map((_, i) => (
//             <Card key={i} className="animate-pulse">
//               <CardHeader className="h-20 bg-muted/50" />
//               <CardContent className="pt-6">
//                 <div className="flex flex-col items-center">
//                   <div className="h-24 w-24 rounded-full bg-muted mb-4" />
//                   <div className="h-6 bg-muted rounded w-32" />
//                   <div className="h-4 bg-muted rounded w-24 mt-2" />
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : filteredStudents.length === 0 ? (
//         <div className="text-center py-16">
//           <div className="h-20 w-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
//             <User className="h-10 w-10 text-muted-foreground" />
//           </div>
//           <p className="text-xl text-muted-foreground">No students found</p>
//           <p className="text-sm text-muted-foreground mt-2">
//             Try adjusting your filters or add a new student.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredStudents.map((student) => (
//             <motion.div
//               key={student.id}
//               layout
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               whileHover={{ y: -6 }}
//               className="group"
//             >
//               <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border">
//                 <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
//                   <div className="flex justify-between items-start">
//                     <Badge variant="secondary" className="font-medium">
//                       {student.student_class}
//                     </Badge>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="opacity-0 group-hover:opacity-100 transition"
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => handleEdit(student)}>
//                           <Edit className="mr-2 h-4 w-4" /> Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           className="text-red-600"
//                           onClick={() => {
//                             if (
//                               window.confirm("Delete this student permanently?")
//                             ) {
//                               deleteMutation.mutate(student.id);
//                             }
//                           }}
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" /> Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-6 text-center">
//                   <Avatar className="h-24 w-24 mx-auto ring-4 ring-background shadow-xl">
//                     <AvatarImage
//                       src={
//                         student.student_image
//                           ? `${API_BASE_URL}/uploads/${student.student_image}`
//                           : undefined
//                       }
//                       alt={`${student.first_name} ${student.last_name}`}
//                     />
//                     <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
//                       {student.first_name[0]}
//                       {student.last_name[0]}
//                     </AvatarFallback>
//                   </Avatar>

//                   <h3 className="mt-4 text-xl font-bold">
//                     {student.first_name} {student.last_name}
//                   </h3>

//                   <div className="mt-3 space-y-2 text-sm">
//                     <div className="flex items-center justify-center gap-2">
//                       <span className="text-muted-foreground">ID:</span>
//                       <code className="font-mono bg-muted px-2 py-1 rounded text-xs">
//                         {student.student_id}
//                       </code>
//                       <button
//                         onClick={() => {
//                           navigator.clipboard.writeText(student.student_id);
//                           toast({ description: "Student ID copied!" });
//                         }}
//                         className="hover:text-primary transition"
//                       >
//                         <Copy className="h-3.5 w-3.5" />
//                       </button>
//                     </div>
//                     <p className="font-semibold text-primary">
//                       Roll: {student.roll_number}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Add/Edit Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">
//               {isEditMode ? "Edit Student" : "Add New Student"}
//             </DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             <div className="grid lg:grid-cols-3 gap-8">
//               {/* Left Column */}
//               <div className="space-y-8">
//                 {/* Photo Upload */}
//                 <div className="space-y-4">
//                   <Label>Student Photo</Label>
//                   <div className="flex justify-center">
//                     <div className="relative group">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         id="photo-upload"
//                         className="hidden"
//                         {...register("student_image")}
//                       />
//                       <label
//                         htmlFor="photo-upload"
//                         className="cursor-pointer block"
//                       >
//                         {previewImage ? (
//                           <div className="relative">
//                             <img
//                               src={previewImage}
//                               alt="Preview"
//                               className="h-48 w-48 rounded-full object-cover ring-8 ring-background shadow-2xl"
//                             />
//                             <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//                               <Upload className="h-12 w-12 text-white" />
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="h-48 w-48 rounded-full bg-muted flex flex-col items-center justify-center border-4 border-dashed border-muted-foreground/30 hover:border-primary transition">
//                             <User className="h-16 w-16 text-muted-foreground" />
//                             <p className="mt-3 text-sm text-muted-foreground">
//                               Click to upload
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               JPG, PNG • Max 2MB
//                             </p>
//                           </div>
//                         )}
//                       </label>
//                       {previewImage && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setPreviewImage(null);
//                             setValue("student_image", null);
//                           }}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition"
//                         >
//                           <X className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Parent Info */}
//                 <div className="p-5 border rounded-xl bg-muted/30 space-y-4">
//                   <h3 className="font-semibold text-lg flex items-center gap-2">
//                     <User className="h-5 w-5" /> Parent / Guardian
//                   </h3>
//                   <div className="space-y-3">
//                     <div>
//                       <Input
//                         {...register("parent_name")}
//                         placeholder="Full Name"
//                       />
//                       {errors.parent_name && (
//                         <p className="text-xs text-destructive mt-1">
//                           {errors.parent_name.message}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <Input
//                         {...register("parent_email")}
//                         type="email"
//                         placeholder="Email"
//                       />
//                       {errors.parent_email && (
//                         <p className="text-xs text-destructive mt-1">
//                           {errors.parent_email.message}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <Input
//                         {...register("parent_mobile")}
//                         placeholder="Mobile Number"
//                       />
//                       {errors.parent_mobile && (
//                         <p className="text-xs text-destructive mt-1">
//                           {errors.parent_mobile.message}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Form */}
//               <div className="lg:col-span-2 space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label>First Name *</Label>
//                     <Input {...register("first_name")} />
//                     {errors.first_name && (
//                       <p className="text-xs text-destructive mt-1">
//                         {errors.first_name.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <Label>Last Name *</Label>
//                     <Input {...register("last_name")} />
//                     {errors.last_name && (
//                       <p className="text-xs text-destructive mt-1">
//                         {errors.last_name.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label>Date of Birth *</Label>
//                     <Input {...register("date_of_birth")} type="date" />
//                     {errors.date_of_birth && (
//                       <p className="text-xs text-destructive mt-1">
//                         {errors.date_of_birth.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <Label>Gender *</Label>
//                     <Select
//                       onValueChange={(v) => setValue("gender", v)}
//                       value={watch("gender")}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select gender" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Male">Male</SelectItem>
//                         <SelectItem value="Female">Female</SelectItem>
//                         <SelectItem value="Other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label>Class *</Label>
//                     <Select
//                       onValueChange={(v) => setValue("student_class", v)}
//                       value={watch("student_class")}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select class" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {classesLoading ? (
//                           <SelectItem value="" disabled>
//                             Loading classes...
//                           </SelectItem>
//                         ) : classes.length === 0 ? (
//                           <SelectItem value="" disabled>
//                             No classes available
//                           </SelectItem>
//                         ) : (
//                           classes.map((cls) => (
//                             <SelectItem key={cls.id} value={cls.class_name}>
//                               {cls.class_name}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                     {errors.student_class && (
//                       <p className="text-xs text-destructive mt-1">
//                         {errors.student_class.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <Label>Admission Date *</Label>
//                     <Input {...register("admission_date")} type="date" />
//                     {errors.admission_date && (
//                       <p className="text-xs text-destructive mt-1">
//                         {errors.admission_date.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <Label>Address (Optional)</Label>
//                   <Textarea
//                     {...register("address")}
//                     rows={3}
//                     placeholder="Enter full address..."
//                   />
//                 </div>

//                 {isEditMode && editingStudent && (
//                   <div className="p-5 bg-primary/5 border rounded-xl">
//                     <h4 className="font-semibold mb-3">Auto-generated Info</h4>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">
//                           Student ID:
//                         </span>
//                         <div className="flex items-center gap-2 mt-1">
//                           <code className="bg-background px-3 py-1 rounded font-mono">
//                             {editingStudent.student_id}
//                           </code>
//                           <Button
//                             type="button"
//                             size="icon"
//                             variant="ghost"
//                             onClick={() => {
//                               navigator.clipboard.writeText(
//                                 editingStudent.student_id
//                               );
//                               toast({ description: "Copied!" });
//                             }}
//                           >
//                             <Copy className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">
//                           Roll Number:
//                         </span>
//                         <p className="font-mono bg-background px-3 py-1 rounded mt-1 inline-block">
//                           {editingStudent.roll_number}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <DialogFooter className="gap-3 sm:justify-between">
//               <Button type="button" variant="outline" onClick={closeDialog}>
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={createMutation.isPending || updateMutation.isPending}
//               >
//                 {createMutation.isPending || updateMutation.isPending
//                   ? "Saving..."
//                   : isEditMode
//                   ? "Update Student"
//                   : "Add Student"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Students;




import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  Copy,
  User,
  X,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../components/ui/use-toast";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";

// Validation Schema
const studentSchema = yup.object({
  first_name: yup.string().required("First name is required").trim(),
  last_name: yup.string().required("Last name is required").trim(),
  date_of_birth: yup.date().required("Date of birth is required").nullable(),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender")
    .required("Gender is required"),
  student_class: yup.string().required("Class is required"),
  admission_date: yup.date().required("Admission date is required").nullable(),
  parent_name: yup.string().required("Parent name is required").trim(),
  parent_email: yup
    .string()
    .email("Invalid email")
    .required("Parent email is required"),
  parent_mobile: yup
    .string()
    .matches(/^\d{10}$/, "Must be exactly 10 digits")
    .required("Mobile number is required"),
  address: yup.string().optional(),
  student_image: yup.mixed().optional(),
});

const Students = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch Classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/student-class/`);
      return res.data.data || [];
    },
  });

  // Fetch Students with Pagination + Search + Class Filter (using backend!)
  const { data: studentResponse, isLoading: studentsLoading } = useQuery({
    queryKey: ["students", page, searchTerm, selectedClass],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (searchTerm) params.append("search", searchTerm);
      if (selectedClass) params.append("student_class", selectedClass);

      const res = await axios.get(`${API_BASE_URL}/api/students/?${params}`);
      return res.data; // { success, total, page, limit, data: [] }
    },
  });

  const students = studentResponse?.data || [];
  const total = studentResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (formData) =>
      axios.post(`${API_BASE_URL}/api/students/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Success", description: "Student added successfully!" });
      closeDialog();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to add student",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) =>
      axios.put(`${API_BASE_URL}/api/students/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Updated", description: "Student updated successfully!" });
      closeDialog();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_BASE_URL}/api/students/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Deleted", description: "Student removed successfully!" });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentSchema),
  });

  const watchedImage = watch("student_image");

  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const url = URL.createObjectURL(watchedImage[0]);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    } else if (!isEditMode) {
      setPreviewImage(null);
    }
  }, [watchedImage, isEditMode]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    reset();
    setPreviewImage(null);
    setIsEditMode(false);
    setEditingStudent(null);
  };

  const openAddDialog = () => {
    setIsEditMode(false);
    setEditingStudent(null);
    reset();
    setPreviewImage(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsEditMode(true);
    setIsDialogOpen(true);

    // Pre-fill form
    const fields = [
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "student_class",
      "admission_date",
      "parent_name",
      "parent_email",
      "parent_mobile",
      "address",
    ];
    fields.forEach((field) => {
      setValue(field, student[field] || "");
    });

    // Set image preview
    if (student.student_image) {
      setPreviewImage(`${API_BASE_URL}/uploads/${student.student_image}`);
    } else {
      setPreviewImage(null);
    }
    setValue("student_image", null); // important: don't send old FileList
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    // Handle image properly
    if (isEditMode && editingStudent?.student_image) {
      // Always send existing_image if editing and no new file
      if (!data.student_image?.[0]) {
        formData.append("existing_image", editingStudent.student_image);
      }
    }

    if (data.student_image?.[0]) {
      formData.append("student_image", data.student_image[0]);
    }

    // Append all other fields
    Object.keys(data).forEach((key) => {
      if (
        key !== "student_image" &&
        data[key] !== null &&
        data[key] !== undefined
      ) {
        if (data[key] instanceof Date) {
          formData.append(key, data[key].toISOString().split("T")[0]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    if (isEditMode) {
      updateMutation.mutate({ id: editingStudent.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student records with ease
          </p>
        </div>
        <Button onClick={openAddDialog} size="lg">
          <Plus className="mr-2 h-5 w-5" /> Add Student
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, roll number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={selectedClass}
          onValueChange={(v) => {
            setSelectedClass(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.class_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students Grid */}
      {studentsLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4" />
                <div className="h-6 bg-muted rounded w-32 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16">
          <User className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No students found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.map((student) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all border">
                  <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary">{student.student_class}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(student)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Delete this student permanently?"
                                )
                              ) {
                                deleteMutation.mutate(student.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto ring-4 ring-background shadow-xl">
                      <AvatarImage
                        src={
                          student.student_image
                            ? `${API_BASE_URL}/uploads/${student.student_image}`
                            : undefined
                        }
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="mt-4 text-xl font-bold">
                      {student.first_name} {student.last_name}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-muted-foreground">ID:</span>
                        <code className="font-mono bg-muted px-2 py-1 rounded text-xs">
                          {student.student_id}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(student.student_id);
                            toast({ description: "Copied!" });
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-semibold text-primary">
                        Roll: {student.roll_number}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isEditMode ? "Edit Student" : "Add New Student"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Photo + Parent */}
              <div className="space-y-8">
                {/* Photo Upload */}
                <div className="space-y-4">
                  <Label>Student Photo</Label>
                  <div className="flex justify-center">
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        id="photo-upload"
                        className="hidden"
                        {...register("student_image")}
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer block"
                      >
                        {previewImage ? (
                          <div className="relative">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="h-48 w-48 rounded-full object-cover ring-8 ring-background shadow-2xl"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Upload className="h-12 w-12 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 w-48 rounded-full bg-muted flex flex-col items-center justify-center border-4 border-dashed">
                            <User className="h-16 w-16 text-muted-foreground" />
                            <p className="mt-3 text-sm">Click to upload</p>
                            <p className="text-xs">JPG, PNG • Max 2MB</p>
                          </div>
                        )}
                      </label>
                      {previewImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setValue("student_image", null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parent Info */}
                <div className="p-5 border rounded-xl bg-muted/30 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5" /> Parent / Guardian
                  </h3>
                  <div className="space-y-3">
                    <Input
                      {...register("parent_name")}
                      placeholder="Full Name"
                    />
                    {errors.parent_name && (
                      <p className="text-xs text-destructive">
                        {errors.parent_name.message}
                      </p>
                    )}

                    <Input
                      {...register("parent_email")}
                      type="email"
                      placeholder="Email"
                    />
                    {errors.parent_email && (
                      <p className="text-xs text-destructive">
                        {errors.parent_email.message}
                      </p>
                    )}

                    <Input
                      {...register("parent_mobile")}
                      placeholder="Mobile (10 digits)"
                    />
                    {errors.parent_mobile && (
                      <p className="text-xs text-destructive">
                        {errors.parent_mobile.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input {...register("first_name")} />
                    {errors.first_name && (
                      <p className="text-xs text-destructive">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input {...register("last_name")} />
                    {errors.last_name && (
                      <p className="text-xs text-destructive">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth *</Label>
                    <Input {...register("date_of_birth")} type="date" />
                    {errors.date_of_birth && (
                      <p className="text-xs text-destructive">
                        {errors.date_of_birth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Gender *</Label>
                    <Select
                      onValueChange={(v) => setValue("gender", v)}
                      value={watch("gender")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Class *</Label>
                    <Select
                      onValueChange={(v) => setValue("student_class", v)}
                      value={watch("student_class")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.class_name}>
                            {cls.class_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.student_class && (
                      <p className="text-xs text-destructive">
                        {errors.student_class.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Admission Date *</Label>
                    <Input {...register("admission_date")} type="date" />
                    {errors.admission_date && (
                      <p className="text-xs text-destructive">
                        {errors.admission_date.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Address (Optional)</Label>
                  <Textarea
                    {...register("address")}
                    rows={3}
                    placeholder="Full address..."
                  />
                </div>

                {isEditMode && editingStudent && (
                  <div className="p-5 bg-primary/5 border rounded-xl">
                    <h4 className="font-semibold mb-3">Auto-generated</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Student ID:
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-background px-3 py-1 rounded font-mono">
                            {editingStudent.student_id}
                          </code>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                editingStudent.student_id
                              );
                              toast({ description: "Copied!" });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Roll No:</span>
                        <p className="font-mono bg-background px-3 py-1 rounded mt-1 inline-block">
                          {editingStudent.roll_number}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEditMode
                  ? "Update Student"
                  : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
