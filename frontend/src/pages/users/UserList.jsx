// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Search,
//   Plus,
//   MoreHorizontal,
//   Edit,
//   Trash,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   X,
// } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Badge } from "../components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../components/ui/dialog";
// import { Label } from "../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { useToast } from "../components/ui/use-toast";
// import { API_BASE_URL } from "../components/ApiConfig/ApiConfig";

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [studentToDelete, setStudentToDelete] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [newStudent, setNewStudent] = useState({
//     username: "",
//     email: "",
//     role_id: "",
//     status: "active", // Changed to lowercase to match backend
//     password: "",
//     confirm_password: "", // Added confirm_password
//   });

//   const { toast } = useToast();
//   const itemsPerPage = 6;

//   // Fetch roles when component mounts
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/role`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch roles");
//         }
//         const data = await response.json();
//         // Ensure data is an array
//         if (Array.isArray(data)) {
//           setRoles(data);
//         } else {
//           throw new Error("Roles data is not an array");
//         }
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to fetch roles: " + error.message,
//         });
//       }
//     };
//     fetchRoles();
//   }, [toast]);

//   // Fetch all users when roles are available
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/v1/users/all`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }
//         const data = await response.json();
//         // Handle different possible response structures
//         let usersArray = [];
//         if (Array.isArray(data)) {
//           usersArray = data;
//         } else if (data && Array.isArray(data.users)) {
//           usersArray = data.users;
//         } else if (data && typeof data === "object") {
//           usersArray = Object.values(data);
//         } else {
//           throw new Error("Users data is not in a valid format");
//         }

//         // Map users to the expected student format
//         const mappedStudents = usersArray.map((user) => ({
//           id: user.id,
//           name: user.username || "Unknown",
//           student_id: user.student_id || "",
//           email: user.email || "",
//           role: user.role ? user.role.toString() : "",
//           role_name: user.role_name || "",
//           status: user.status || "active",
//           // student_id: user.student_id || "",
//           avatar: user.avatar || "",
//         }));
//         setStudents(mappedStudents);
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to fetch users: " + error.message,
//         });
//       }
//     };
//     if (roles.length > 0) {
//       fetchUsers();
//     }
//   }, [toast, roles]);

//   // Filter students based on search and filters
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch =
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesRole = selectedRole ? student.role === selectedRole : true;
//     const matchesStatus = selectedStatus
//       ? student.status === selectedStatus
//       : true;

//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
//   const paginatedStudents = filteredStudents.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // For adding new students
//   const handleAddStudent = async () => {
//     if (
//       !newStudent.username ||
//       !newStudent.email ||
//       !newStudent.role_id ||
//       !newStudent.status ||
//       !newStudent.password ||
//       !newStudent.confirm_password
//     ) {
//       toast({
//         variant: "destructive",
//         title: "Missing information",
//         description: "Please fill in all required fields.",
//       });
//       return;
//     }

//     if (newStudent.password !== newStudent.confirm_password) {
//       toast({
//         variant: "destructive",
//         title: "Password mismatch",
//         description: "Password and confirm password do not match.",
//       });
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           role_id: parseInt(newStudent.role_id),
//           username: newStudent.username,
//           email: newStudent.email,
//           password: newStudent.password,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.log("Backend error:", errorData); // Added for debugging
//         throw new Error(errorData.error || "Failed to create user");
//       }

//       const data = await response.json();
//       const newUser = {
//         id: data.user.id, // Fixed: Use data.user.id instead of data.userId
//         name: newStudent.username,
//         email: newStudent.email,
//         role_id: newStudent.role_id,
//         status: newStudent.status,
//         avatar: "",
//       };

//       setStudents([...students, newUser]);
//       setNewStudent({
//         username: "",
//         email: "",
//         role_id: "",
//         status: "active",
//         password: "",
//         confirm_password: "", // Reset confirm_password
//       });
//       setIsAddDialogOpen(false);

//       toast({
//         title: "Student added",
//         description: `${newStudent.username} has been added successfully.`,
//       });
//     } catch (error) {
//       console.log("Error in handleAddStudent:", error); // Added for debugging
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     }
//   };

//   // For deleting students
//   const handleDeleteStudent = async () => {
//     if (!studentToDelete) return;

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/v1/users/${studentToDelete.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to delete user");
//       }

//       setStudents(
//         students.filter((student) => student.id !== studentToDelete.id)
//       );
//       setIsDeleteDialogOpen(false);
//       setStudentToDelete(null);

//       toast({
//         title: "Student removed",
//         description: "The student has been removed successfully.",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewStudent({ ...newStudent, [name]: value });
//   };

//   const handleSelectChange = (name, value) => {
//     setNewStudent({ ...newStudent, [name]: value });
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedRole("");
//     setSelectedStatus("");
//     setCurrentPage(1);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Users</h2>
//           <p className="text-muted-foreground">
//             Manage user records and information
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add User
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[500px]">
//               <DialogHeader>
//                 <DialogTitle>Add New User</DialogTitle>
//                 <DialogDescription>
//                   Enter the details of the new user below.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="username">Name</Label>
//                     <Input
//                       id="username"
//                       name="username"
//                       value={newStudent.username}
//                       onChange={handleInputChange}
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={newStudent.email}
//                       onChange={handleInputChange}
//                       placeholder="john.doe@example.com"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="role">Role</Label>
//                     <Select
//                       value={newStudent.role_id} // Fixed: Use role_id
//                       onValueChange={(value) =>
//                         handleSelectChange("role_id", value)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select role" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         {roles.map((role) => (
//                           <SelectItem key={role.id} value={role.id.toString()}>
//                             {role.role_name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="status">Status</Label>
//                     <Select
//                       value={newStudent.status}
//                       onValueChange={(value) =>
//                         handleSelectChange("status", value)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="active">Active</SelectItem>
//                         <SelectItem value="inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input
//                       id="password"
//                       name="password"
//                       type="password"
//                       value={newStudent.password}
//                       onChange={handleInputChange}
//                       placeholder="Enter password"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirm_password">Confirm Password</Label>
//                     <Input
//                       id="confirm_password"
//                       name="confirm_password"
//                       type="password"
//                       value={newStudent.confirm_password}
//                       onChange={handleInputChange}
//                       placeholder="Confirm password"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsAddDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={handleAddStudent}>Add Student</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       <div className="flex flex-col gap-4 md:flex-row">
//         <div className="flex-1">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search users..."
//               className="pl-8"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Select value={selectedRole} onValueChange={setSelectedRole}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Role" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Roles</SelectItem>
//               {roles.map((role) => (
//                 <SelectItem key={role.id} value={role.id.toString()}>
//                   {role.role_name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Status</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="ghost" size="icon" onClick={resetFilters}>
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {filteredStudents.length === 0 ? (
//         <Card className="border-dashed">
//           <CardContent className="flex flex-col items-center justify-center py-10">
//             <div className="rounded-full bg-primary/10 p-3">
//               <Search className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="mt-4 text-lg font-medium">No users found</h3>
//             <p className="mt-2 text-center text-sm text-muted-foreground">
//               No users match your search criteria. Try adjusting your filters or
//               add a new user.
//             </p>
//             <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add User
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
//           >
//             {paginatedStudents.map((student) => (
//               <motion.div
//                 key={student.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <div className="flex items-center justify-between">
//                       <Badge
//                         variant={
//                           student.status === "active" ? "default" : "outline"
//                         }
//                         className={
//                           student.status === "active"
//                             ? "bg-green-500 text-white hover:bg-green-600"
//                             : "bg-red-500 text-white hover:bg-red-600"
//                         }
//                       >
//                         {student.status}
//                       </Badge>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem>
//                             <Eye className="mr-2 h-4 w-4" />
//                             View Details
//                           </DropdownMenuItem>
//                           <DropdownMenuItem>
//                             <Edit className="mr-2 h-4 w-4" />
//                             Edit User
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             className="text-destructive focus:text-destructive"
//                             onClick={() => {
//                               setStudentToDelete(student);
//                               setIsDeleteDialogOpen(true);
//                             }}
//                           >
//                             <Trash className="mr-2 h-4 w-4" />
//                             Delete Student
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center gap-4">
//                       <Avatar className="h-16 w-16">
//                         <AvatarImage src={student.avatar} />
//                         <AvatarFallback className="text-lg">
//                           {student.name.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <h3 className="font-semibold">{student.name}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           {student.email}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
//                       <div>
//                         <p className="text-muted-foreground">Role</p>
//                         <p className="font-medium">{student.role_name}</p>
//                       </div>
//                       {/* <div>
//                         <p className="text-muted-foreground">Student ID</p>
//                         <p className="font-medium">{student.student_id}</p>
//                       </div> */}
//                     </div>
//                   </CardContent>
//                   <CardFooter className="border-t px-6 py-3">
//                     <Button variant="ghost" className="w-full">
//                       View Full Profile
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>

//           {totalPages > 1 && (
//             <div className="flex items-center justify-center space-x-2 py-4">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "outline"}
//                     size="icon"
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </Button>
//                 )
//               )}
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() =>
//                   setCurrentPage(Math.min(totalPages, currentPage + 1))
//                 }
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </>
//       )}

//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this student? This action cannot
//               be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             {studentToDelete && (
//               <div className="flex items-center gap-4">
//                 <Avatar>
//                   <AvatarFallback>
//                     {studentToDelete.name.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-medium">{studentToDelete.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     Role {studentToDelete.role_name}, Status{" "}
//                     {studentToDelete.status}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsDeleteDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteStudent}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Students;




// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import {
//   Search,
//   Plus,
//   MoreHorizontal,
//   Edit,
//   Trash,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Upload,
// } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Card, CardContent, CardHeader } from "../../components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
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
//   DialogDescription,
//   DialogFooter,
// } from "../../components/ui/dialog";
// import { Label } from "../../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { useToast } from "../../components/ui/use-toast";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [previewImage, setPreviewImage] = useState(null);
//   const fileInputRef = useRef(null);

//   const { toast } = useToast();
//   const itemsPerPage = 6;

//   // Form state for new user
//   const [newUser, setNewUser] = useState({
//     username: "",
//     email: "",
//     role_id: "",
//     password: "",
//     confirm_password: "",
//     status: "active", // Added default status
//     user_profile: null,
//   });

//   // Fetch roles
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

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/v1/users/all`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch users");

//         const data = await response.json();
//         const usersArray = Array.isArray(data) ? data : data.users || [];

//         const mappedUsers = usersArray.map((user) => {
//           const roleName =
//             user.role_name ||
//             roles.find((r) => r.id === user.role_id)?.role_name ||
//             "Unknown";

//           return {
//             id: user.id,
//             name: user.username,
//             email: user.email,
//             role_id: user.role_id?.toString(),
//             role_name: roleName,
//             status: user.status || "active",
//             avatar: user.user_profile
//               ? `${API_BASE_URL}/profiles/${user.user_profile}` // Uses /profiles/ → WORKS
//               : null,
//           };
//         });

//         setUsers(mappedUsers);
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to fetch users.",
//         });
//       }
//     };

//     if (roles.length > 0) fetchUsers();
//   }, [toast, roles]);

//   // Handle image change
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewUser({ ...newUser, user_profile: file });
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   // Handle Add User
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
//     formData.append("status", status); // Now sending status
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
//       const createdUser = result.user;

//       const fullAvatarUrl = createdUser.user_profile
//         ? `${API_BASE_URL}/profiles/${createdUser.user_profile}`
//         : null;

//       const roleName =
//         roles.find((r) => r.id === createdUser.role_id)?.role_name || "Unknown";

//       setUsers((prev) => [
//         ...prev,
//         {
//           id: createdUser.id,
//           name: createdUser.username,
//           email: createdUser.email,
//           role_id: createdUser.role_id.toString(),
//           role_name: roleName,
//           status: createdUser.status,
//           avatar: fullAvatarUrl,
//         },
//       ]);

//       // Reset form
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
//       setIsAddDialogOpen(false);

//       toast({
//         title: "Success",
//         description: `${createdUser.username} added successfully!`,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     }
//   };

//   // Delete user
//   const handleDeleteUser = async () => {
//     if (!userToDelete) return;

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/v1/users/${userToDelete.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to delete user");

//       setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
//       setIsDeleteDialogOpen(false);
//       setUserToDelete(null);
//       toast({ title: "Deleted", description: "User removed successfully." });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     }
//   };

//   // Filters
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = selectedRole ? user.role_id === selectedRole : true;
//     const matchesStatus = selectedStatus
//       ? user.status === selectedStatus
//       : true;
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedRole("");
//     setSelectedStatus("");
//     setCurrentPage(1);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Users</h2>
//           <p className="text-muted-foreground">
//             Manage user accounts and permissions
//           </p>
//         </div>
//         <Button onClick={() => setIsAddDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" /> Add User
//         </Button>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-col gap-4 md:flex-row">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search users..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2">
//           <Select value={selectedRole} onValueChange={setSelectedRole}>
//             <SelectTrigger className="w-40">
//               <SelectValue placeholder="Role" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Roles</SelectItem>
//               {roles.map((role) => (
//                 <SelectItem key={role.id} value={role.id.toString()}>
//                   {role.role_name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//             <SelectTrigger className="w-40">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Status</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button variant="ghost" size="icon" onClick={resetFilters}>
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Users Grid */}
//       {filteredUsers.length === 0 ? (
//         <Card className="border-dashed text-center py-12">
//           <CardContent>
//             <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//             <h3 className="text-lg font-medium">No users found</h3>
//             <p className="text-sm text-muted-foreground">
//               Try adjusting filters or add a new user.
//             </p>
//             <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
//               <Plus className="mr-2 h-4 w-4" /> Add User
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {paginatedUsers.map((user) => (
//               <motion.div
//                 key={user.id}
//                 layout
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 <Card>
//                   <CardHeader>
//                     <div className="flex justify-between items-start">
//                       <Badge
//                         variant={
//                           user.status === "active" ? "default" : "secondary"
//                         }
//                         className={
//                           user.status === "active"
//                             ? "bg-green-600"
//                             : "bg-gray-500"
//                         }
//                       >
//                         {user.status}
//                       </Badge>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem>
//                             <Eye className="mr-2 h-4 w-4" /> View
//                           </DropdownMenuItem>
//                           <DropdownMenuItem>
//                             <Edit className="mr-2 h-4 w-4" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             className="text-destructive"
//                             onClick={() => {
//                               setUserToDelete(user);
//                               setIsDeleteDialogOpen(true);
//                             }}
//                           >
//                             <Trash className="mr-2 h-4 w-4" /> Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex gap-4">
 
//                       <img
//                         src={user.avatar || "/default-user.png"}
//                         alt={user.name}
//                         className="h-16 w-16 rounded-full object-cover border"
//                       />

//                       <div className="space-y-1">
//                         <h3 className="font-semibold text-lg">{user.name}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           {user.email}
//                         </p>
//                         <p className="text-sm font-medium text-primary">
//                           {user.role_name}
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-8">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <Button
//                   key={i + 1}
//                   variant={currentPage === i + 1 ? "default" : "outline"}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </Button>
//               ))}
//               <Button
//                 variant="outline"
//                 size="icon"
//                 disabled={currentPage === totalPages}
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Add User Dialog */}
//       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Add New User</DialogTitle>
//             <DialogDescription>
//               Create a new user account with profile picture and status.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-6 py-4">
//             {/* Profile Image */}
//             <div className="flex justify-center">
//               <div className="relative">
//                 <Avatar className="h-32 w-32">
//                   <AvatarImage src={previewImage || ""} />
//                   <AvatarFallback className="text-4xl">
//                     {newUser.username[0]?.toUpperCase() || "?"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <label
//                   htmlFor="user_profile"
//                   className="absolute bottom-0 right-0 cursor-pointer"
//                 >
//                   <div className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90">
//                     <Upload className="h-5 w-5" />
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     id="user_profile"
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               </div>
//             </div>

//             {/* Form Fields */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Username</Label>
//                 <Input
//                   value={newUser.username}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, username: e.target.value })
//                   }
//                   placeholder="John Doe"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   value={newUser.email}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, email: e.target.value })
//                   }
//                   placeholder="john@example.com"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Role</Label>
//                 <Select
//                   value={newUser.role_id}
//                   onValueChange={(v) => setNewUser({ ...newUser, role_id: v })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {roles.map((role) => (
//                       <SelectItem key={role.id} value={role.id.toString()}>
//                         {role.role_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Status</Label>
//                 <Select
//                   value={newUser.status}
//                   onValueChange={(v) => setNewUser({ ...newUser, status: v })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Password</Label>
//                 <Input
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, password: e.target.value })
//                   }
//                   placeholder="••••••••"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Confirm Password</Label>
//                 <Input
//                   type="password"
//                   value={newUser.confirm_password}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, confirm_password: e.target.value })
//                   }
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddUser}>Create User</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete User</DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the
//               user.
//             </DialogDescription>
//           </DialogHeader>
//           {userToDelete && (
//             <div className="flex items-center gap-4 py-4">
//               <Avatar>
//                 <AvatarImage src={userToDelete.avatar} />
//                 <AvatarFallback>{userToDelete.name[0]}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-medium">{userToDelete.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {userToDelete.email}
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   {userToDelete.role_name} • {userToDelete.status}
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
//             <Button variant="destructive" onClick={handleDeleteUser}>
//               Delete User
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Users;





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
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-sm text-gray-500">Manage system users, roles & permissions</p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button component={Link} to="/user/create" className={styles.primaryBtn} variant="contained">
              + Add Student
            </Button>
            
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
                <th className="p-3">Profiles</th>
                <th className="p-3">Users</th>
                <th className="p-3">Roles</th>
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

                  </td>
              
                  <td className="p-3">{student.className}</td>
                  <td className="p-3">{student.roll}</td>
                  <td className="p-3">
                    <span className={styles.status}>{student.status}</span>
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => setViewUser(u)}
                      className="text-indigo-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditUser(u);
                        setShowForm(true);
                      }}
                      className="text-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => resetPassword(u)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
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