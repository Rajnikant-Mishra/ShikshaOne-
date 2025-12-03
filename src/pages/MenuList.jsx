// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Search, Plus, Trash, MoreHorizontal } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardFooter,
// } from "../components/ui/card";
// import { Avatar, AvatarFallback } from "../components/ui/avatar";
// import { Badge } from "../components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import { useToast } from "../components/ui/use-toast";
// import axios from "axios";
// import { API_BASE_URL } from "../components/ApiConfig/ApiConfig";

// const Menu = () => {
//   const [roles, setRoles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [newRole, setNewRole] = useState({ role_name: "" });
//   const { toast } = useToast();

//   // Filter roles based on search
//   const filteredRoles = roles.filter((role) =>
//     role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle input change for new role
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRole({ ...newRole, [name]: value });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Module</h2>
//           <p className="text-muted-foreground">Manage Modules</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Module
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[500px]">
//               <DialogHeader>
//                 <DialogTitle>Add New Module</DialogTitle>
//                 <DialogDescription>
//                   Enter the details of the new module below.
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label htmlFor="role_name">Module Title</label>
//                     <Input
//                       id="role_name"
//                       name="role_name"
//                       value={newRole.role_name}
//                       onChange={handleInputChange}
//                       placeholder="Enter role name"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="role_name">Module Title</label>
//                     <Input
//                       id="role_name"
//                       name="role_name"
//                       value={newRole.role_name}
//                       onChange={handleInputChange}
//                       placeholder="Enter role name"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="role_name">Module Icon</label>
//                     <Input
//                       id="role_name"
//                       name="role_name"
//                       value={newRole.role_name}
//                       onChange={handleInputChange}
//                       placeholder="Enter role name"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="role_name">Module Icon</label>
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
//                 <Button onClick={handleAddRole}>Add Module</Button>
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
//             placeholder="Search modules..."
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
//             <h3 className="mt-4 text-lg font-medium">No Modules found</h3>
//             <p className="mt-2 text-center text-sm text-muted-foreground">
//               No Modules match your search criteria. Try adjusting your search
//               or add a new Module.
//             </p>
//             <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Module
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
//                     <Badge>Module</Badge>
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

// export default Menu;

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

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [newMenu, setNewMenu] = useState({
    title: "",
    link: "",
    image: "",
    updated_by: "",
  });
  const { toast } = useToast();

  // ================== FETCH MENUS ===================
  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menu`);
      setMenus(res.data);
    } catch (error) {
      toast({
        title: "Error fetching menus",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ================== ADD MENU ===================
  const handleAddMenu = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/menu`, newMenu);
      toast({ title: "Menu added successfully" });
      setIsAddDialogOpen(false);
      setNewMenu({ title: "", link: "", image: "", updated_by: "" });
      fetchMenus();
    } catch (error) {
      toast({
        title: "Error adding menu",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // ================== DELETE MENU ===================
  const handleDeleteMenu = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/menu/${menuToDelete.id}`);
      toast({ title: "Menu deleted successfully" });
      setIsDeleteDialogOpen(false);
      fetchMenus();
    } catch (error) {
      toast({
        title: "Error deleting menu",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // ================== INPUT HANDLER ===================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenu({ ...newMenu, [name]: value });
  };

  // ================== FILTER ===================
  const filteredMenus = menus.filter((menu) =>
    menu.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
          <p className="text-muted-foreground">Manage your application menus</p>
        </div>

        {/* Add Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Menu</DialogTitle>
              <DialogDescription>
                Enter the details of the new menu below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title">Menu Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={newMenu.title}
                    onChange={handleInputChange}
                    placeholder="Enter menu title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="link">Menu Link</label>
                  <Input
                    id="link"
                    name="link"
                    value={newMenu.link}
                    onChange={handleInputChange}
                    placeholder="Enter Link"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="image">Menu Icon</label>
                  <Input
                    id="image"
                    name="image"
                    value={newMenu.image}
                    onChange={handleInputChange}
                    placeholder="Enter Icon"
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
              <Button onClick={handleAddMenu}>Add Menu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search menus..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* No data */}
      {filteredMenus.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Menus Found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Try adjusting your search or add a new menu.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu
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
          {filteredMenus.map((menu) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge>Menu</Badge>
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
                            setMenuToDelete(menu);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Menu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {menu.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{menu.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {menu.link}
                      </p>
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
              Are you sure you want to delete this menu? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {menuToDelete && (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {menuToDelete.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{menuToDelete.title}</p>
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
            <Button variant="destructive" onClick={handleDeleteMenu}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
