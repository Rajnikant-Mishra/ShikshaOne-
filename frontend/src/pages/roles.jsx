// import React, { useState } from "react";
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

// // Mock data for students
// const initialStudents = [
//   {
//     id: "1",
//     name: "Emma Wilson",
//     email: "emma.wilson@example.com",
//     grade: "10",
//     section: "A",
//     rollNumber: "1001",
//     gender: "Female",
//     status: "Active",
//     attendance: "95%",
//     avatar: "",
//   },
//   {
//     id: "2",
//     name: "James Rodriguez",
//     email: "james.r@example.com",
//     grade: "10",
//     section: "B",
//     rollNumber: "1002",
//     gender: "Male",
//     status: "Active",
//     attendance: "88%",
//     avatar: "",
//   },
//   {
//     id: "3",
//     name: "Sophia Chen",
//     email: "sophia.c@example.com",
//     grade: "9",
//     section: "A",
//     rollNumber: "901",
//     gender: "Female",
//     status: "Active",
//     attendance: "92%",
//     avatar: "",
//   },
//   {
//     id: "4",
//     name: "Ethan Brown",
//     email: "ethan.b@example.com",
//     grade: "9",
//     section: "B",
//     rollNumber: "902",
//     gender: "Male",
//     status: "Inactive",
//     attendance: "78%",
//     avatar: "",
//   },
//   {
//     id: "5",
//     name: "Olivia Martinez",
//     email: "olivia.m@example.com",
//     grade: "11",
//     section: "A",
//     rollNumber: "1101",
//     gender: "Female",
//     status: "Active",
//     attendance: "97%",
//     avatar: "",
//   },
//   {
//     id: "6",
//     name: "Noah Johnson",
//     email: "noah.j@example.com",
//     grade: "11",
//     section: "B",
//     rollNumber: "1102",
//     gender: "Male",
//     status: "Active",
//     attendance: "91%",
//     avatar: "",
//   },
//   {
//     id: "7",
//     name: "Ava Williams",
//     email: "ava.w@example.com",
//     grade: "12",
//     section: "A",
//     rollNumber: "1201",
//     gender: "Female",
//     status: "Active",
//     attendance: "94%",
//     avatar: "",
//   },
//   {
//     id: "8",
//     name: "Liam Smith",
//     email: "liam.s@example.com",
//     grade: "12",
//     section: "B",
//     rollNumber: "1202",
//     gender: "Male",
//     status: "Inactive",
//     attendance: "82%",
//     avatar: "",
//   },
// ];

// const Role = () => {
//   const [students, setStudents] = useState(initialStudents);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [studentToDelete, setStudentToDelete] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [newStudent, setNewStudent] = useState({
//     name: "",
//     email: "",
//     grade: "",
//     section: "",
//     rollNumber: "",
//     gender: "",
//     status: "Active",
//   });

//   const { toast } = useToast();
//   const itemsPerPage = 6;

//   // Filter students based on search and filters
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch =
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
//     const matchesSection = selectedSection
//       ? student.section === selectedSection
//       : true;
//     const matchesStatus = selectedStatus
//       ? student.status === selectedStatus
//       : true;

//     return matchesSearch && matchesGrade && matchesSection && matchesStatus;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
//   const paginatedStudents = filteredStudents.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleAddStudent = () => {
//     if (
//       !newStudent.name ||
//       !newStudent.email ||
//       !newStudent.grade ||
//       !newStudent.section ||
//       !newStudent.rollNumber
//     ) {
//       toast({
//         variant: "destructive",
//         title: "Missing information",
//         description: "Please fill in all required fields.",
//       });
//       return;
//     }

//     const id = (students.length + 1).toString();
//     const studentWithId = { ...newStudent, id, attendance: "0%", avatar: "" };

//     setStudents([...students, studentWithId]);
//     setNewStudent({
//       name: "",
//       email: "",
//       grade: "",
//       section: "",
//       rollNumber: "",
//       gender: "",
//       status: "Active",
//     });

//     setIsAddDialogOpen(false);

//     toast({
//       title: "Student added",
//       description: `${newStudent.name} has been added successfully.`,
//     });
//   };

//   const handleDeleteStudent = () => {
//     if (!studentToDelete) return;

//     setStudents(
//       students.filter((student) => student.id !== studentToDelete.id)
//     );
//     setIsDeleteDialogOpen(false);
//     setStudentToDelete(null);

//     toast({
//       title: "Role removed",
//       description: "The role has been removed successfully.",
//     });
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
//     setSelectedGrade("");
//     setSelectedSection("");
//     setSelectedStatus("");
//     setCurrentPage(1);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
//           <p className="text-muted-foreground">Manage students role</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Role
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[500px]">
//               <DialogHeader>
//                 <DialogTitle>Add New Role</DialogTitle>
//                 <DialogDescription>
//                   Enter the details of the new role below.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Role</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       value={newStudent.name}
//                       onChange={handleInputChange}
//                       placeholder="Enter role name"
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
//                 <Button onClick={handleAddStudent}>Add Role</Button>
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
//               placeholder="Search roles..."
//               className="pl-8"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {filteredStudents.length === 0 ? (
//         <Card className="border-dashed">
//           <CardContent className="flex flex-col items-center justify-center py-10">
//             <div className="rounded-full bg-primary/10 p-3">
//               <Search className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="mt-4 text-lg font-medium">No roles found</h3>
//             <p className="mt-2 text-center text-sm text-muted-foreground">
//               No roles match your search criteria. Try adjusting your filters or
//               add a new role.
//             </p>
//             <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Role
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

//           {/* Pagination */}
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

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this role? This action cannot
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
//                     Grade {studentToDelete.grade}, Section{" "}
//                     {studentToDelete.section}
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

// export default Role;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useToast } from "../components/ui/use-toast";
import axios from "axios";
import { API_BASE_URL } from "../components/ApiConfig/ApiConfig";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [newRole, setNewRole] = useState({ role_name: "" });
  const { toast } = useToast();

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/role`);
        setRoles(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch roles.",
        });
      }
    };
    fetchRoles();
  }, []);

  // Filter roles based on search
  const filteredRoles = roles.filter((role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new role
  const handleAddRole = async () => {
    if (!newRole.role_name) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Role name is required.",
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/role`, {
        role_name: newRole.role_name,
      });
      setRoles([
        ...roles,
        { id: response.data.id, role_name: newRole.role_name },
      ]);
      setNewRole({ role_name: "" });
      setIsAddDialogOpen(false);
      toast({
        title: "Role added",
        description: `${newRole.role_name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add role.",
      });
    }
  };

  // Handle deleting a role (assuming a DELETE endpoint exists)
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      // Note: Backend does not provide a DELETE endpoint; this is a placeholder
      await axios.delete(`${API_BASE_URL}/api/role/${roleToDelete.id}`);
      setRoles(roles.filter((role) => role.id !== roleToDelete.id));
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
      toast({
        title: "Role removed",
        description: "The role has been removed successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete role.",
      });
    }
  };

  // Handle input change for new role
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">Manage roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
                <DialogDescription>
                  Enter the details of the new role below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="role_name">Role Name</label>
                    <Input
                      id="role_name"
                      name="role_name"
                      value={newRole.role_name}
                      onChange={handleInputChange}
                      placeholder="Enter role name"
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
                <Button onClick={handleAddRole}>Add Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRoles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No roles found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              No roles match your search criteria. Try adjusting your search or
              add a new role.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredRoles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge>Role</Badge>
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
                            setRoleToDelete(role);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {role.role_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{role.role_name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {roleToDelete && (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {roleToDelete.role_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{roleToDelete.role_name}</p>
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
            <Button variant="destructive" onClick={handleDeleteRole}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Role;
