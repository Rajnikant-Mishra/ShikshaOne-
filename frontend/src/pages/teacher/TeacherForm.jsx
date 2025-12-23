// import React, { useState, useRef } from "react";
// import { Home, Upload } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../components/ui/avatar";
// import { Label } from "../../components/ui/label";
// import { Input } from "../../components/ui/input";
// import { Checkbox } from "../../components/ui/checkbox";
// import { useToast } from "../../components/ui/use-toast";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
// import { Link } from "react-router-dom";
// import { ChevronRight } from "lucide-react";

// // React Hook Form & Yup
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// // Validation Schema
// const schema = yup.object({
//   name: yup.string().required("Teacher name is required"),
//   employee_id: yup.string().required("Employee ID is required"),
//   phone: yup
//     .string()
//     .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
//     .required("Phone is required"),
//   email: yup
//     .string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   subjects: yup
//     .array()
//     .min(1, "Select at least one subject")
//     .required("Subjects are required"),
//   classes: yup
//     .array()
//     .min(1, "Select at least one class")
//     .required("Classes are required"),
// });

// const subjectsList = ["Mathematics", "Science", "English", "Hindi", "Computer"];
// const classesList = ["1A", "2A", "3B", "4A", "5A", "6B"];

// const AddTeacherForm = () => {
//   const [previewImage, setPreviewImage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       name: "",
//       employee_id: "",
//       phone: "",
//       email: "",
//       subjects: [],
//       classes: [],
//     },
//   });

//   const name = watch("name");

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   // Handle checkbox changes
//   const handleCheckboxChange = (field, value) => {
//     const current = watch(field) || [];
//     if (current.includes(value)) {
//       setValue(
//         field,
//         current.filter((item) => item !== value)
//       );
//     } else {
//       setValue(field, [...current, value]);
//     }
//   };

//   // Form submission
//   const onSubmit = async (data) => {
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("employee_id", data.employee_id);
//     formData.append("phone", data.phone);
//     formData.append("email", data.email);
//     data.subjects.forEach((subject) =>
//       formData.append("subjects[]", subject)
//     );
//     data.classes.forEach((cls) => formData.append("classes[]", cls));
//     if (selectedFile) {
//       formData.append("profile_image", selectedFile);
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/teachers`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || "Failed to add teacher");
//       }

//       const result = await response.json();

//       // Reset form
//       reset();
//       setPreviewImage(null);
//       setSelectedFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       toast({
//         title: "Success",
//         description: `${result.teacher?.name || data.name} added successfully!`,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     }
//   };

//   return (
//     <div className="">
//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 text-sm mb-8">
//         <Link
//           to="/"
//           className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
//         >
//           <Home className="h-4 w-4" />
//           Dashboard
//         </Link>
//         <ChevronRight className="h-4 w-4 text-gray-500" />
//         <Link to="/teacher" className="text-blue-600 hover:text-blue-800">
//           Teachers
//         </Link>
//         <ChevronRight className="h-4 w-4 text-gray-500" />
//         <span className="text-gray-700 font-medium">Add New Teacher</span>
//       </div>

//       <Card className="shadow-lg">
//         <CardHeader className="text-center">
//           <CardTitle className="text-3xl font-bold">Add New Teacher</CardTitle>
//           <p className="text-muted-foreground mt-1">
//             Register a new teacher with subjects and class assignments.
//           </p>
//         </CardHeader>

//         <CardContent className="space-y-8">
//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Teacher Name</Label>
//                 <Input
//                   id="name"
//                   {...register("name")}
//                   placeholder="e.g. John Smith"
//                   className={errors.name ? "border-red-500" : ""}
//                 />
//                 {errors.name && (
//                   <p className="text-sm text-red-600">{errors.name.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="employee_id">Employee ID</Label>
//                 <Input
//                   id="employee_id"
//                   {...register("employee_id")}
//                   placeholder="e.g. EMP001"
//                   className={errors.employee_id ? "border-red-500" : ""}
//                 />
//                 {errors.employee_id && (
//                   <p className="text-sm text-red-600">
//                     {errors.employee_id.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   {...register("phone")}
//                   placeholder="e.g. 9876543210"
//                   className={errors.phone ? "border-red-500" : ""}
//                 />
//                 {errors.phone && (
//                   <p className="text-sm text-red-600">{errors.phone.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   {...register("email")}
//                   placeholder="john@school.com"
//                   className={errors.email ? "border-red-500" : ""}
//                 />
//                 {errors.email && (
//                   <p className="text-sm text-red-600">{errors.email.message}</p>
//                 )}
//               </div>
//             </div>

//             {/* Subjects */}
//             <div className="space-y-3">
//               <Label>Subjects</Label>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
//                 {subjectsList.map((subject) => (
//                   <div key={subject} className="flex items-center space-x-3">
//                     <Checkbox
//                       id={subject}
//                       checked={watch("subjects")?.includes(subject)}
//                       onCheckedChange={() =>
//                         handleCheckboxChange("subjects", subject)
//                       }
//                     />
//                     <label
//                       htmlFor={subject}
//                       className="text-sm font-medium cursor-pointer select-none"
//                     >
//                       {subject}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//               {errors.subjects && (
//                 <p className="text-sm text-red-600">
//                   {errors.subjects.message}
//                 </p>
//               )}
//             </div>

//             {/* Classes */}
//             <div className="space-y-3">
//               <Label>Classes</Label>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
//                 {classesList.map((cls) => (
//                   <div key={cls} className="flex items-center space-x-3">
//                     <Checkbox
//                       id={cls}
//                       checked={watch("classes")?.includes(cls)}
//                       onCheckedChange={() =>
//                         handleCheckboxChange("classes", cls)
//                       }
//                     />
//                     <label
//                       htmlFor={cls}
//                       className="text-sm font-medium cursor-pointer select-none"
//                     >
//                       {cls}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//               {errors.classes && (
//                 <p className="text-sm text-red-600">{errors.classes.message}</p>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-4 pt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="lg"
//                 onClick={() => reset()}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" size="lg" className="flex justify-end">
//                 Save Teacher
//               </Button>

//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddTeacherForm;

// import React, { useState, useRef } from "react";
// import { Home, ChevronRight } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Label } from "../../components/ui/label";
// import { Input } from "../../components/ui/input";
// import { Checkbox } from "../../components/ui/checkbox";
// import { useToast } from "../../components/ui/use-toast";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// // Fetch Classes & Subjects from API
// const fetchClasses = async () => {
//   const { data } = await axios.get(`${API_BASE_URL}/api/student-class/`);
//   return Array.isArray(data) ? data : data?.data || data?.results || [];
// };

// const fetchSubjects = async () => {
//   const { data } = await axios.get(`${API_BASE_URL}/api/subjects/`);
//   return Array.isArray(data) ? data : data?.data || data?.results || [];
// };

// // Validation Schema (updated to match backend)
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// const schema = yup.object({
//   name: yup.string().required("Teacher name is required"),
//   phone: yup
//     .string()
//     .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
//     .required("Phone is required"),
//   email: yup
//     .string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   joining_date: yup.date().required("Joining date is required"),
//   subjects: yup
//     .array()
//     .of(yup.number())
//     .min(1, "Select at least one subject")
//     .required("Subjects are required"),
//   classes: yup
//     .array()
//     .of(yup.number())
//     .min(1, "Select at least one class")
//     .required("Classes are required"),
// });

// const AddTeacherForm = () => {
//   const { toast } = useToast();
//   const fileInputRef = useRef(null);

//   const { data: classes = [], isLoading: classesLoading } = useQuery({
//     queryKey: ["classes"],
//     queryFn: fetchClasses,
//   });

//   const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
//     queryKey: ["subjects"],
//     queryFn: fetchSubjects,
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     setValue,
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       name: "",
//       phone: "",
//       email: "",
//       joining_date: "",
//       subjects: [],
//       classes: [],
//     },
//   });

//   // Watch selected values for checkbox UI
//   const selectedSubjects = watch("subjects") || [];
//   const selectedClasses = watch("classes") || [];

//   // Handle checkbox toggle
//   const handleCheckboxChange = (field, id, checked) => {
//     const current = watch(field) || [];
//     if (checked) {
//       setValue(field, [...current, id]);
//     } else {
//       setValue(
//         field,
//         current.filter((item) => item !== id)
//       );
//     }
//   };

//   // Form submission
//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/teacher/`,
//         {
//           name: data.name,
//           email: data.email,
//           phone: data.phone,
//           joining_date: data.joining_date,
//           classes: data.classes, // array of class IDs
//           subjects: data.subjects, // array of subject IDs
//           // status: "Active", // default
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       reset();
//       toast({
//         title: "Success!",
//         description: `${response.data.teacher.name} has been added successfully.`,
//       });
//     } catch (error) {
//       const message =
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to add teacher. Please try again.";

//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: message,
//       });
//     }
//   };

//   const isLoading = classesLoading || subjectsLoading;

//   return (
//     <div className="">
//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 text-sm mb-8">
//         <Link
//           to="/"
//           className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
//         >
//           <Home className="h-4 w-4" />
//           Dashboard
//         </Link>
//         <ChevronRight className="h-4 w-4 text-gray-500" />
//         <Link to="/teacher" className="text-blue-600 hover:text-blue-800">
//           Teachers
//         </Link>
//         <ChevronRight className="h-4 w-4 text-gray-500" />
//         <span className="text-gray-700 font-medium">Add New Teacher</span>
//       </div>

//       <Card className="shadow-lg">
//         <CardHeader className="text-center">
//           <CardTitle className="text-3xl font-bold">Add New Teacher</CardTitle>
//           <p className="text-muted-foreground mt-1">
//             Register a new teacher with subjects and class assignments.
//           </p>
//         </CardHeader>

//         <CardContent className="space-y-8">
//           {isLoading ? (
//             <div className="text-center py-8">
//               Loading classes and subjects...
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Teacher Name</Label>
//                   <Input
//                     id="name"
//                     {...register("name")}
//                     placeholder="e.g. John Smith"
//                     className={errors.name ? "border-red-500" : ""}
//                   />
//                   {errors.name && (
//                     <p className="text-sm text-red-600">
//                       {errors.name.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="joining_date">Joining Date</Label>
//                   <Input
//                     id="joining_date"
//                     type="date"
//                     {...register("joining_date")}
//                     className={errors.joining_date ? "border-red-500" : ""}
//                   />
//                   {errors.joining_date && (
//                     <p className="text-sm text-red-600">
//                       {errors.joining_date.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone</Label>
//                   <Input
//                     id="phone"
//                     type="tel"
//                     {...register("phone")}
//                     placeholder="e.g. 9876543210"
//                     className={errors.phone ? "border-red-500" : ""}
//                   />
//                   {errors.phone && (
//                     <p className="text-sm text-red-600">
//                       {errors.phone.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     {...register("email")}
//                     placeholder="john@school.com"
//                     className={errors.email ? "border-red-500" : ""}
//                   />
//                   {errors.email && (
//                     <p className="text-sm text-red-600">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Subjects Selection */}
//               <div className="space-y-3">
//                 <Label>Subjects</Label>
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
//                   {subjects.map((subject) => (
//                     <div
//                       key={subject.id}
//                       className="flex items-center space-x-3"
//                     >
//                       <Checkbox
//                         id={`subject-${subject.id}`}
//                         checked={selectedSubjects.includes(subject.id)}
//                         onCheckedChange={(checked) =>
//                           handleCheckboxChange("subjects", subject.id, checked)
//                         }
//                       />
//                       <label
//                         htmlFor={`subject-${subject.id}`}
//                         className="text-sm font-medium cursor-pointer select-none"
//                       >
//                         {subject.subject_name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.subjects && (
//                   <p className="text-sm text-red-600">
//                     {errors.subjects.message}
//                   </p>
//                 )}
//               </div>

//               {/* Classes Selection */}
//               <div className="space-y-3">
//                 <Label>Classes</Label>
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
//                   {classes.map((cls) => (
//                     <div key={cls.id} className="flex items-center space-x-3">
//                       <Checkbox
//                         id={`class-${cls.id}`}
//                         checked={selectedClasses.includes(cls.id)}
//                         onCheckedChange={(checked) =>
//                           handleCheckboxChange("classes", cls.id, checked)
//                         }
//                       />
//                       <label
//                         htmlFor={`class-${cls.id}`}
//                         className="text-sm font-medium cursor-pointer select-none"
//                       >
//                         {cls.class_name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.classes && (
//                   <p className="text-sm text-red-600">
//                     {errors.classes.message}
//                   </p>
//                 )}
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-4 pt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="lg"
//                   onClick={() => reset()}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" size="lg" disabled={isSubmitting}>
//                   {isSubmitting ? "Saving..." : "Save Teacher"}
//                 </Button>
//               </div>
//             </form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddTeacherForm;



import React from "react";
import { Home, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { useToast } from "../../components/ui/use-toast";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema - FIX: use string for joining_date
const schema = yup.object({
  name: yup.string().required("Teacher name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
    .required("Phone is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  joining_date: yup
    .string()
    .required("Joining date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  subjects: yup
    .array()
    .of(yup.number())
    .min(1, "Select at least one subject")
    .required(),
  classes: yup
    .array()
    .of(yup.number())
    .min(1, "Select at least one class")
    .required(),
});

const fetchClasses = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/student-class/`);
  return Array.isArray(data) ? data : data?.data || data?.results || [];
};

const fetchSubjects = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/subjects/`);
  return Array.isArray(data) ? data : data?.data || data?.results || [];
};

const AddTeacherForm = () => {
  const { toast } = useToast();

  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      joining_date: "",
      subjects: [],
      classes: [],
    },
  });

  const selectedSubjects = watch("subjects") || [];
  const selectedClasses = watch("classes") || [];

  const handleCheckboxChange = (field, id, checked) => {
    const current = watch(field) || [];
    if (checked) {
      setValue(field, [...current, id]);
    } else {
      setValue(
        field,
        current.filter((item) => item !== id)
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      // FIX 1: Correct endpoint (plural!)
      const response = await axios.post(
        `${API_BASE_URL}/api/teacher/`, // ← was /teacher/ → wrong!
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          joining_date: data.joining_date, // already string "YYYY-MM-DD"
          classes: data.classes,
          subjects: data.subjects,
          status: "Active", // safe to send
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      reset();
      toast({
        title: "Success!",
        description: `Teacher ${
          response.data.teacher?.name || data.name
        } added successfully!`,
      });
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to add teacher.";

      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });

      console.error("Submit error:", error.response?.data || error);
    }
  };

  const isLoading = classesLoading || subjectsLoading;

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link
          to="/"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <Link to="/teacher" className="text-blue-600 hover:text-blue-800">
          Teachers
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700 font-medium">Add New Teacher</span>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Add New Teacher</CardTitle>
          <p className="text-muted-foreground mt-1">
            Register a new teacher with subjects and class assignments.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {isLoading ? (
            <div className="text-center py-8">
              Loading classes and subjects...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Teacher Name</Label>
                  <Input
                    {...register("name")}
                    placeholder="e.g. John Smith"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joining_date">Joining Date</Label>
                  <Input
                    type="date"
                    {...register("joining_date")}
                    className={errors.joining_date ? "border-red-500" : ""}
                  />
                  {errors.joining_date && (
                    <p className="text-sm text-red-600">
                      {errors.joining_date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="tel"
                    {...register("phone")}
                    placeholder="9876543210"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="john@school.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-3">
                <Label>Subjects</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`subject-${subject.id}`}
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("subjects", subject.id, checked)
                        }
                      />
                      <label
                        htmlFor={`subject-${subject.id}`}
                        className="text-sm font-medium cursor-pointer select-none"
                      >
                        {subject.subject_name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.subjects && (
                  <p className="text-sm text-red-600">
                    {errors.subjects.message}
                  </p>
                )}
              </div>

              {/* Classes */}
              <div className="space-y-3">
                <Label>Classes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`class-${cls.id}`}
                        checked={selectedClasses.includes(cls.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("classes", cls.id, checked)
                        }
                      />
                      <label
                        htmlFor={`class-${cls.id}`}
                        className="text-sm font-medium cursor-pointer select-none"
                      >
                        {cls.class_name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.classes && (
                  <p className="text-sm text-red-600">
                    {errors.classes.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Teacher"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTeacherForm;
