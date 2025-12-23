// import React, { useState, useEffect, useRef } from "react";
// // import { Upload } from "lucide-react";
// import { ChevronLeft, ChevronRight, Upload, X, Home } from "lucide-react";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { Input } from "../../components/ui/input";
// import { useToast } from "../../components/ui/use-toast";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
// import { Link } from "react-router-dom";

// const AddUserForm = () => {
//   const [roles, setRoles] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);
//   const fileInputRef = useRef(null);
//   const { toast } = useToast();

//   const [newUser, setNewUser] = useState({
//     username: "",
//     email: "",
//     role_id: "",
//     password: "",
//     confirm_password: "",
//     status: "active",
//     user_profile: null,
//   });

//   // Fetch roles on mount
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/role`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch roles");
//         const data = await response.json();
//         setRoles(Array.isArray(data) ? data : data.roles || []);
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to load roles.",
//         });
//       }
//     };
//     fetchRoles();
//   }, [toast]);

//   // Handle image change
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewUser({ ...newUser, user_profile: file });
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   // Handle Create User
//   const handleAddUser = async () => {
//     const { username, email, role_id, password, confirm_password, status } =
//       newUser;

//     if (!username || !email || !role_id || !password || !confirm_password) {
//       toast({
//         variant: "destructive",
//         title: "Missing fields",
//         description: "Please fill all required fields.",
//       });
//       return;
//     }

//     if (password !== confirm_password) {
//       toast({
//         variant: "destructive",
//         title: "Password mismatch",
//         description: "Passwords do not match.",
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("role_id", role_id);
//     formData.append("status", status);
//     if (newUser.user_profile) {
//       formData.append("user_profile", newUser.user_profile);
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || "Failed to create user");
//       }

//       const result = await response.json();

//       // Reset form after success
//       setNewUser({
//         username: "",
//         email: "",
//         role_id: "",
//         password: "",
//         confirm_password: "",
//         status: "active",
//         user_profile: null,
//       });
//       setPreviewImage(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       toast({
//         title: "Success",
//         description: `${result.user.username} added successfully!`,
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
//       <div className="flex items-center gap-2 text-sm mb-6">
//         <Link
//           to="/"
//           className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
//         >
//           <Home className="h-4 w-4 text-blue-600" />
//           Dashboard
//         </Link>

//         <ChevronRight className="h-4 w-4 text-blue-600" />

//         <Link to="/users" className="text-blue-600 hover:text-blue-700">
//           Users
//         </Link>

//         <ChevronRight className="h-4 w-4 text-blue-600" />

//         <span className="text-600 font-medium">Add New User</span>
//       </div>
//       <Card>
//         <CardHeader className="flex flex-col items-center text-center">
//           <CardTitle className="text-2xl">Add New User</CardTitle>
//           <p className="text-muted-foreground">
//             Create a new user account with profile picture and permissions.
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-8">
//           {/* Profile Image */}
//           <div className="flex justify-left">
//             <div className="relative">
//               <Avatar className="h-32 w-32">
//                 <AvatarImage src={previewImage || ""} />
//                 <AvatarFallback className="text-4xl">
//                   {newUser.username[0]?.toUpperCase() || "?"}
//                 </AvatarFallback>
//               </Avatar>
//               <label
//                 htmlFor="user_profile"
//                 className="absolute bottom-0 right-0 cursor-pointer"
//               >
//                 <div className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90">
//                   <Upload className="h-5 w-5" />
//                 </div>
//                 <input
//                   ref={fileInputRef}
//                   id="user_profile"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImageChange}
//                 />
//               </label>
//             </div>
//           </div>

//           {/* Form Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label>Username</Label>
//               <Input
//                 value={newUser.username}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, username: e.target.value })
//                 }
//                 placeholder="John Doe"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={newUser.email}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, email: e.target.value })
//                 }
//                 placeholder="john@example.com"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Role</Label>
//               <Select
//                 value={newUser.role_id}
//                 onValueChange={(v) => setNewUser({ ...newUser, role_id: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {roles.map((role) => (
//                     <SelectItem key={role.id} value={role.id.toString()}>
//                       {role.role_name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Status</Label>
//               <Select
//                 value={newUser.status}
//                 onValueChange={(v) => setNewUser({ ...newUser, status: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 value={newUser.password}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, password: e.target.value })
//                 }
//                 placeholder="Enter password"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Confirm Password</Label>
//               <Input
//                 type="password"
//                 value={newUser.confirm_password}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, confirm_password: e.target.value })
//                 }
//                 placeholder="confirm password"
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <Button size="lg" onClick={handleAddUser}>
//               Create User
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddUserForm;





import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Upload, X, Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
import { Link } from "react-router-dom";

// React Hook Form & Yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema
const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  role_id: yup.string().required("Role is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  status: yup.string().required("Status is required"),
});

const AddUserForm = () => {
  const [roles, setRoles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      role_id: "",
      password: "",
      confirm_password: "",
      status: "active",
    },
  });

  // Watch username for avatar fallback
  const username = watch("username");

  // Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/role`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch roles");
        const data = await response.json();
        setRoles(Array.isArray(data) ? data : data.roles || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load roles.",
        });
      }
    };
    fetchRoles();
  }, [toast]);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role_id", data.role_id);
    formData.append("status", data.status);
    if (selectedFile) {
      formData.append("user_profile", selectedFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create user");
      }

      const result = await response.json();

      // Reset form and preview
      reset();
      setPreviewImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast({
        title: "Success",
        description: `${result.user.username} added successfully!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="">
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <Home className="h-4 w-4 text-blue-600" />
          Dashboard
        </Link>

        <ChevronRight className="h-4 w-4 text-blue-600" />

        <Link to="/users" className="text-blue-600 hover:text-blue-700">
          Users
        </Link>

        <ChevronRight className="h-4 w-4 text-blue-600" />

        <span className="text-600 font-medium">Add New User</span>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-2xl">Add New User</CardTitle>
          <p className="text-muted-foreground">
            Create a new user account with profile picture and permissions.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Profile Image */}
          <div className="flex justify-left">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewImage || ""} />
                <AvatarFallback className="text-4xl">
                  {username[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="user_profile"
                className="absolute bottom-0 right-0 cursor-pointer"
              >
                <div className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90">
                  <Upload className="h-5 w-5" />
                </div>
                <input
                  ref={fileInputRef}
                  id="user_profile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  {...register("username")}
                  placeholder="John Doe"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  onValueChange={(value) => setValue("role_id", value)}
                  value={watch("role_id")}
                >
                  <SelectTrigger
                    className={errors.role_id ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role_id && (
                  <p className="text-sm text-red-600">
                    {errors.role_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  value={watch("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Enter password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  {...register("confirm_password")}
                  placeholder="Confirm password"
                  className={errors.confirm_password ? "border-red-500" : ""}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-600">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button size="lg" type="submit">
                Create User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUserForm;
