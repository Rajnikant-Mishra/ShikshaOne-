// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Search, Plus, Trash, MoreHorizontal } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardFooter,
// } from "../../components/ui/card";
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
// import axios from "axios";
// import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";

// const Role = () => {
//   const [roles, setRoles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [newRole, setNewRole] = useState({ role_name: "" });
//   const { toast } = useToast();

//   // Fetch roles from backend
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/role`);
//         setRoles(response.data);
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to fetch roles.",
//         });
//       }
//     };
//     fetchRoles();
//   }, []);

//   // Filter roles based on search
//   const filteredRoles = roles.filter((role) =>
//     role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle adding a new role
//   const handleAddRole = async () => {
//     if (!newRole.role_name) {
//       toast({
//         variant: "destructive",
//         title: "Missing information",
//         description: "Role name is required.",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/role`, {
//         role_name: newRole.role_name,
//       });
//       setRoles([
//         ...roles,
//         { id: response.data.id, role_name: newRole.role_name },
//       ]);
//       setNewRole({ role_name: "" });
//       setIsAddDialogOpen(false);
//       toast({
//         title: "Role added",
//         description: `${newRole.role_name} has been added successfully.`,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to add role.",
//       });
//     }
//   };

//   // Handle deleting a role (assuming a DELETE endpoint exists)
//   const handleDeleteRole = async () => {
//     if (!roleToDelete) return;

//     try {
//       // Note: Backend does not provide a DELETE endpoint; this is a placeholder
//       await axios.delete(`${API_BASE_URL}/api/role/${roleToDelete.id}`);
//       setRoles(roles.filter((role) => role.id !== roleToDelete.id));
//       setIsDeleteDialogOpen(false);
//       setRoleToDelete(null);
//       toast({
//         title: "Role removed",
//         description: "The role has been removed successfully.",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to delete role.",
//       });
//     }
//   };

//   // Handle input change for new role
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRole({ ...newRole, [name]: value });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
//           <p className="text-muted-foreground">Manage roles</p>
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
//                     <label htmlFor="role_name">Role Name</label>
//                     <Input
//                       id="role_name"
//                       name="role_name"
//                       value={newRole.role_name}
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
//                 <Button onClick={handleAddRole}>Add Role</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       <div className="flex-1">
//         <div className="relative">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search roles..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {filteredRoles.length === 0 ? (
//         <Card className="border-dashed">
//           <CardContent className="flex flex-col items-center justify-center py-10">
//             <div className="rounded-full bg-primary/10 p-3">
//               <Search className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="mt-4 text-lg font-medium">No roles found</h3>
//             <p className="mt-2 text-center text-sm text-muted-foreground">
//               No roles match your search criteria. Try adjusting your search or
//               add a new role.
//             </p>
//             <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Role
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
//         >
//           {filteredRoles.map((role) => (
//             <motion.div
//               key={role.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Card>
//                 <CardHeader className="pb-2">
//                   <div className="flex items-center justify-between">
//                     <Badge>Role</Badge>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           className="text-destructive focus:text-destructive"
//                           onClick={() => {
//                             setRoleToDelete(role);
//                             setIsDeleteDialogOpen(true);
//                           }}
//                         >
//                           <Trash className="mr-2 h-4 w-4" />
//                           Delete Role
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-4">
//                     <Avatar className="h-16 w-16">
//                       <AvatarFallback className="text-lg">
//                         {role.role_name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-semibold">{role.role_name}</h3>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this role? This action cannot be
//               undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             {roleToDelete && (
//               <div className="flex items-center gap-4">
//                 <Avatar>
//                   <AvatarFallback>
//                     {roleToDelete.role_name.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <p className="font-medium">{roleToDelete.role_name}</p>
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
//             <Button variant="destructive" onClick={handleDeleteRole}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Role;

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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";

const Role = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [roleName, setRoleName] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch Roles
  const { data: rolesData = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/role`);
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  const roles = rolesData || [];

  // Filter roles client-side
  const filteredRoles = roles.filter((role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => axios.post(`${API_BASE_URL}/api/role`, data),
    onSuccess: (response) => {
      toast({ title: "Success", description: "Role created successfully" });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create role",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      axios.put(`${API_BASE_URL}/api/role/${id}`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Role updated successfully" });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_BASE_URL}/api/role/${id}`),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Role deleted successfully" });
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete role",
      });
    },
  });

  // Reset form and dialogs
  const resetForm = () => {
    setRoleName("");
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setRoleToEdit(null);
  };

  // Submit handler (create or update)
  const handleSubmit = () => {
    if (!roleName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Role name is required",
      });
      return;
    }

    if (roleToEdit) {
      updateMutation.mutate({
        id: roleToEdit.id,
        data: { role_name: roleName },
      });
    } else {
      createMutation.mutate({ role_name: roleName });
    }
  };

  // Edit handler
  const handleEdit = (role) => {
    setRoleToEdit(role);
    setRoleName(role.role_name);
    setIsEditDialogOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">
            Manage user roles in the system
          </p>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setRoleName("");
                setRoleToEdit(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Create a new role for user permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="role_name" className="text-sm font-medium">
                  Role Name
                </label>
                <Input
                  id="role_name"
                  placeholder="e.g., Admin, Teacher, Student"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Adding..." : "Add Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search roles..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Loading State */}
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
                  <div className="h-6 bg-muted rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRoles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">No roles found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or add a new role.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredRoles.map((role) => (
            <Card key={role.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <Badge variant="secondary">Role</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(role)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setRoleToDelete(role);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg font-bold bg-primary/10">
                      {role.role_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{role.role_name}</h3>
                    <p className="text-sm text-muted-foreground">User Role</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Edit Dialog - Same form as Add */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update the name of this role.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="role_name_edit" className="text-sm font-medium">
                Role Name
              </label>
              <Input
                id="role_name_edit"
                placeholder="e.g., Admin, Teacher"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {roleToDelete && (
            <div className="flex items-center gap-4 py-4">
              <Avatar>
                <AvatarFallback className="bg-primary/10">
                  {roleToDelete.role_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">
                  {roleToDelete.role_name}
                </p>
              </div>
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
              onClick={() => deleteMutation.mutate(roleToDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Role;
