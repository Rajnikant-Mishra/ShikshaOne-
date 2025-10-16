// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Search,
//   Plus,
//   Filter,
//   Download,
//   MoreHorizontal,
//   Edit,
//   Trash,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
// import { API_BASE_URL } from "../components/ApiConfig/ApiConfig";

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [roles, setRoles] = useState([]); // State for roles
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
//     role: "", // Changed from grade to role
//     student_id:"",
//     status: "Active",
//     password: "",
//     confirm_password: "",
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
//         setRoles(data); // Store roles
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

//   // Fetch all users when component mounts
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/users`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }
//         const data = await response.json();
//         const mappedStudents = data.map((user) => ({
//           id: user.id,
//           name: user.username,
//           email: user.email,
//           role: user.role.toString(),
//           status: user.status,
//           student_id: user.student_id || "",
//           avatar: "",
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
//     fetchUsers();
//   }, [toast]);

//   // Filter students based on search and filters
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch =
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

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

//   const handleAddStudent = async () => {
//     if (
//       !newStudent.username ||
//       !newStudent.email ||
//       !newStudent.role ||
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
//       const response = await fetch(`${API_BASE_URL}/api/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           role: parseInt(newStudent.role),
//           username: newStudent.username,
//           email: newStudent.email,
//           phone: null, // Optional field
//           status: newStudent.status,
//           password: newStudent.password,
//           confirm_password: newStudent.confirm_password,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to create user");
//       }

//       const data = await response.json();
//       const newUser = {
//         id: data.userId,
//         name: newStudent.username,
//         email: newStudent.email,
//         role: newStudent.role,
//         status: newStudent.status,
//         rollNumber: data.student_id || "",
//         attendance: "0%",
//         avatar: "",
//       };

//       setStudents([...students, newUser]);
//       setNewStudent({
//         username: "",
//         email: "",
//         role: "",
//         status: "Active",
//         password: "",
//         confirm_password: "",
//       });
//       setIsAddDialogOpen(false);

//       toast({
//         title: "Student added",
//         description: `${newStudent.username} has been added successfully.`,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     }
//   };

//   const handleDeleteStudent = async () => {
//     if (!studentToDelete) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/users/${studentToDelete.id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to delete user");
//       }

//       setStudents(students.filter((student) => student.id !== studentToDelete.id));
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
//                       value={newStudent.role}
//                       onValueChange={(value) =>
//                         handleSelectChange("role", value)
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
//                         <SelectItem value="Active">Active</SelectItem>
//                         <SelectItem value="Inactive">Inactive</SelectItem>
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
//               <SelectItem value="Active">Active</SelectItem>
//               <SelectItem value="Inactive">Inactive</SelectItem>
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
//               No users match your search criteria. Try adjusting your filters
//               or add a new user.
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
//                           student.status === "Active" ? "default" : "outline"
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
//                             Edit Student
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
//                         <p className="font-medium">{student.role}</p>
//                       </div>

//                       <div>
//                         <p className="text-muted-foreground">Student ID</p>
//                         <p className="font-medium">{student.student_id}</p>
//                       </div>
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
//                     Role {studentToDelete.role}, Status {studentToDelete.status}
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
//     status: "Active",
//     password: "",
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
//           usersArray = data.users; // Handle nested array like { users: [...] }
//         } else if (data && typeof data === "object") {
//           usersArray = Object.values(data); // Convert object values to array if applicable
//         } else {
//           throw new Error("Users data is not in a valid format");
//         }

//         // Map users to the expected student format
//         const mappedStudents = usersArray.map((user) => ({
//           id: user.id,
//           name: user.username || "Unknown",
//           user_id: user.user_id || "",
//           email: user.email || "",
//           role: user.role ? user.role.toString() : "",
//           role_name: user.role_name || "",
//           status: user.status || "Active",
//           student_id: user.student_id || "",
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
//     // Only fetch users if roles are available
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
//       !newStudent.password
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
//       const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
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
//         throw new Error(errorData.error || "Failed to create user");
//       }

//       const data = await response.json();
//       const newUser = {
//         id: data.userId,
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
//         status: "Active",
//         password: "",

//       });
//       setIsAddDialogOpen(false);

//       toast({
//         title: "Student added",
//         description: `${newStudent.username} has been added successfully.`,
//       });
//     } catch (error) {
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
//         `${API_BASE_URL}/api/users/${studentToDelete.id}`,
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
//                       value={newStudent.role}
//                       onValueChange={(value) =>
//                         handleSelectChange("role", value)
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
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
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
//                         <SelectItem value="Active">Active</SelectItem>
//                         <SelectItem value="Inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
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
//               <SelectItem value="Active">Active</SelectItem>
//               <SelectItem value="Inactive">Inactive</SelectItem>
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
//                       {/* <Badge
//                         variant={
//                           student.status === "Active" ? "default" : "outline"
//                         }
//                       >
//                         {student.status}
//                       </Badge> */}
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
//                             Edit Student
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
//                       <div>
//                         <p className="text-muted-foreground">Student ID</p>
//                         <p className="font-medium">{student.user_id}</p>
//                       </div>
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

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { API_BASE_URL } from "../components/ApiConfig/ApiConfig";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newStudent, setNewStudent] = useState({
    username: "",
    email: "",
    role_id: "",
    status: "active", // Changed to lowercase to match backend
    password: "",
    confirm_password: "", // Added confirm_password
  });

  const { toast } = useToast();
  const itemsPerPage = 6;

  // Fetch roles when component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/role`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          throw new Error("Roles data is not an array");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch roles: " + error.message,
        });
      }
    };
    fetchRoles();
  }, [toast]);

  // Fetch all users when roles are available
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        // Handle different possible response structures
        let usersArray = [];
        if (Array.isArray(data)) {
          usersArray = data;
        } else if (data && Array.isArray(data.users)) {
          usersArray = data.users;
        } else if (data && typeof data === "object") {
          usersArray = Object.values(data);
        } else {
          throw new Error("Users data is not in a valid format");
        }

        // Map users to the expected student format
        const mappedStudents = usersArray.map((user) => ({
          id: user.id,
          name: user.username || "Unknown",
          student_id: user.student_id || "",
          email: user.email || "",
          role: user.role ? user.role.toString() : "",
          role_name: user.role_name || "",
          status: user.status || "active",
          student_id: user.student_id || "",
          avatar: user.avatar || "",
        }));
        setStudents(mappedStudents);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch users: " + error.message,
        });
      }
    };
    if (roles.length > 0) {
      fetchUsers();
    }
  }, [toast, roles]);

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole ? student.role === selectedRole : true;
    const matchesStatus = selectedStatus
      ? student.status === selectedStatus
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // For adding new students
  const handleAddStudent = async () => {
    if (
      !newStudent.username ||
      !newStudent.email ||
      !newStudent.role_id ||
      !newStudent.status ||
      !newStudent.password ||
      !newStudent.confirm_password
    ) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (newStudent.password !== newStudent.confirm_password) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Password and confirm password do not match.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          role_id: parseInt(newStudent.role_id),
          username: newStudent.username,
          email: newStudent.email,
          password: newStudent.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Backend error:", errorData); // Added for debugging
        throw new Error(errorData.error || "Failed to create user");
      }

      const data = await response.json();
      const newUser = {
        id: data.user.id, // Fixed: Use data.user.id instead of data.userId
        name: newStudent.username,
        email: newStudent.email,
        role_id: newStudent.role_id,
        status: newStudent.status,
        avatar: "",
      };

      setStudents([...students, newUser]);
      setNewStudent({
        username: "",
        email: "",
        role_id: "",
        status: "active",
        password: "",
        confirm_password: "", // Reset confirm_password
      });
      setIsAddDialogOpen(false);

      toast({
        title: "Student added",
        description: `${newStudent.username} has been added successfully.`,
      });
    } catch (error) {
      console.log("Error in handleAddStudent:", error); // Added for debugging
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // For deleting students
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/${studentToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setStudents(
        students.filter((student) => student.id !== studentToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);

      toast({
        title: "Student removed",
        description: "The student has been removed successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewStudent({ ...newStudent, [name]: value });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user records and information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the details of the new user below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Name</Label>
                    <Input
                      id="username"
                      name="username"
                      value={newStudent.username}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newStudent.role_id} // Fixed: Use role_id
                      onValueChange={(value) =>
                        handleSelectChange("role_id", value)
                      }
                    >
                      <SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newStudent.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newStudent.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={newStudent.confirm_password}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>Add Student</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={resetFilters}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No users found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              No users match your search criteria. Try adjusting your filters or
              add a new user.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedStudents.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "outline"
                        }
                        className={
                          student.status === "active"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }
                      >
                        {student.status}
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setStudentToDelete(student);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="text-lg">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Role</p>
                        <p className="font-medium">{student.role_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Student ID</p>
                        <p className="font-medium">{student.student_id}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-3">
                    <Button variant="ghost" className="w-full">
                      View Full Profile
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {studentToDelete && (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {studentToDelete.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{studentToDelete.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Role {studentToDelete.role_name}, Status{" "}
                    {studentToDelete.status}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
