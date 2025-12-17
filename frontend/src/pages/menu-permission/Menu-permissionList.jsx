import React, { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
import { useToast } from "../../components/ui/use-toast";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../../components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

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

const getIcon = (name) => {
  if (!name) return null;
  return Icons[name] || null;
};

const RoleMenuPermission = () => {
  const { toast } = useToast();

  // List Data
  const [roleMenus, setRoleMenus] = useState([]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form Data
  const [selectedMenu, setSelectedMenu] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Data dropdowns
  const [menus, setMenus] = useState([]);
  const [roles, setRoles] = useState([]);

  const [deleteItem, setDeleteItem] = useState(null);

  // ===================== Fetch All Data =====================
  const fetchRoleMenuList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menurole/role-menu-all`);
      setRoleMenus(res?.data?.data || []);
    } catch (error) {
      toast({
        title: "Error fetching permissions",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menu`);
      setMenus(res.data.data || []);
    } catch (error) {}
  };



  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/role`);

      // If backend returns array directly
      if (Array.isArray(res.data)) {
        setRoles(res.data);
        return;
      }

      // If backend returns {data:[...]}
      setRoles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoleMenuList();
    fetchMenus();
    fetchRoles();
  }, []);

  // ===================== Assign Menu → Role ====================

  const handleAssign = async () => {
  if (!selectedMenu) {
    toast({ title: "Select a menu", variant: "destructive" });
    return;
  }
  if (!selectedRole) {
    toast({ title: "Select a role", variant: "destructive" });
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/api/menurole/assign`, {
      menu_id: Number(selectedMenu),
      role_ids: [Number(selectedRole)],
    });

    // ✅ Show success toast first
    toast({ title: "Permission Assigned Successfully" });

    // Small delay so toast actually displays
    setTimeout(() => {
      setIsAddDialogOpen(false);
      setSelectedMenu("");
      setSelectedRole("");
      fetchRoleMenuList();
    }, 100);

  } catch (error) {
    toast({
      title: "Failed to assign",
      description: error.response?.data?.message || error.message,
      variant: "destructive",
    });
  }
};


  // ===================== Delete ====================
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/menurole/assign/${deleteItem.id}`
      );
      toast({ title: "Permission deleted" });
      setIsDeleteDialogOpen(false);
      fetchRoleMenuList();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // ===================== Filter Search ====================
  const filtered = useMemo(
    () =>
      roleMenus.filter((rm) =>
        (rm.role_name + rm.menu_title)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [roleMenus, searchTerm]
  );

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Role Menu Permission</h2>
          <p className="text-muted-foreground">
            Assign Menus to Roles and Manage Permissions
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Permission</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Permission</DialogTitle>
              <DialogDescription>
                Choose a Menu and a Role to assign permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-6">
              {/* Menu Select */}
              <div className="space-y-2">
                <label>Select Menu</label>
                <Select value={selectedMenu} onValueChange={setSelectedMenu}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose menu..." />
                  </SelectTrigger>
                  <SelectContent>
                    {menus.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <label>Select Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssign}>Assign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <div>
        <Input
          placeholder="Search role or menu..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p>No permissions found</p>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <Badge>Permission</Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icons.MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setDeleteItem(item);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Icons.Trash size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <p className="font-semibold">{item.role_name}</p>
                <p className="text-sm text-muted-foreground">
                  Menu → {item.menu_title}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Permission?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p>
              Delete permission:{" "}
              <b>
                {deleteItem?.role_name} → {deleteItem?.menu_title}
              </b>
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleMenuPermission;
