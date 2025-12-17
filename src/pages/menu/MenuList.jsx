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

const ICON_OPTIONS = [
  "Home",
  "Users",
  "Calendar",
  "Settings",
  "Menu",
  "Bell",
  "Sun",
  "Moon",
  "LogOut",
  "GraduationCap",
  "BookOpen",
  "ClipboardCheck",
  "BarChart3",
  "UserPen",
  "UserPlus", // slight variant in lucide
  "MapPin",
  "Landmark",
  "ChevronDown",
  "X",
  "Search",
  "MoreHorizontal",
  "Plus",
  "Trash",
];

const getIcon = (name) => {
  if (!name) return null;
  return Icons[name] || null;
};

const Menu = () => {
  const { toast } = useToast();

  const [menus, setMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [newMenu, setNewMenu] = useState({
    title: "",
    link: "",
    image: "", // store icon NAME, e.g. "Home"
    updated_by: "",
  });

  // Icon picker UI state
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  // ================== FETCH MENUS ===================
  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menu`);
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setMenus(data);
    } catch (error) {
      toast({
        title: "Error fetching menus",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================== ADD MENU ===================
  const handleAddMenu = async () => {
    try {
      // Basic validation
      if (!newMenu.title) {
        toast({ title: "Title is required", variant: "destructive" });
        return;
      }
      await axios.post(`${API_BASE_URL}/api/menu`, newMenu);
      toast({ title: "Menu added successfully" });
      setIsAddDialogOpen(false);
      setNewMenu({ title: "", link: "", image: "", updated_by: "" });
      fetchMenus();
    } catch (error) {
      toast({
        title: "Error adding menu",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    }
  };

  // ================== DELETE MENU ===================
  const handleDeleteMenu = async () => {
    try {
      if (!menuToDelete) return;
      await axios.delete(`${API_BASE_URL}/api/menu/${menuToDelete.id}`);
      toast({ title: "Menu deleted successfully" });
      setIsDeleteDialogOpen(false);
      setMenuToDelete(null);
      fetchMenus();
    } catch (error) {
      toast({
        title: "Error deleting menu",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    }
  };

  // ================== INPUT HANDLER ===================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenu((p) => ({ ...p, [name]: value }));
  };

  // Filter menus by search
  const filteredMenus = useMemo(
    () =>
      menus.filter((m) =>
        (m.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [menus, searchTerm]
  );

  // Icons filtered by iconSearch
  const filteredIcons = useMemo(() => {
    const q = iconSearch.trim().toLowerCase();
    if (!q) return ICON_OPTIONS;
    return ICON_OPTIONS.filter((name) =>
      name.toLowerCase().includes(q)
    );
  }, [iconSearch]);

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
              {getIcon("Plus") && React.createElement(getIcon("Plus"), { size: 16, className: "mr-2" })}
              Add Menu
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Menu</DialogTitle>
              <DialogDescription>Enter the details of the new menu below.</DialogDescription>
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

                {/* Icon Picker */}
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label>Menu Icon</label>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => setIsIconPickerOpen((s) => !s)}
                      >
                        <div className="flex items-center gap-2">
                          {newMenu.image && getIcon(newMenu.image) ? (
                            React.createElement(getIcon(newMenu.image), { size: 20 })
                          ) : (
                            <span className="text-sm text-muted-foreground">Select Icon</span>
                          )}
                          <span className="text-sm">{newMenu.image ? "" : ""}</span>
                        </div>
                        {getIcon("ChevronDown") && React.createElement(getIcon("ChevronDown"), { size: 16 })}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[320px] p-3">
                      <div className="mb-2">
                        <Input
                          placeholder="Search icons..."
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          className="mb-2"
                        />
                      </div>

                      <div className="grid grid-cols-6 gap-2 max-h-64 overflow-auto">
                        {filteredIcons.map((iconName) => {
                          const IconComp = getIcon(iconName);
                          return (
                            <button
                              key={iconName}
                              onClick={() => {
                                setNewMenu((p) => ({ ...p, image: iconName }));
                                setIsIconPickerOpen(false);
                              }}
                              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-muted/50"
                              type="button"
                            >
                              <div className="rounded-md p-2">
                                {IconComp ? React.createElement(IconComp, { size: 20 }) : <span className="text-xs">{iconName}</span>}
                              </div>
                              <span className="text-[11px] truncate">{iconName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Updated by (optional) */}
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label htmlFor="updated_by">Updated By</label>
                  <Input
                    id="updated_by"
                    name="updated_by"
                    value={newMenu.updated_by}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
          {getIcon("Search") && React.createElement(getIcon("Search"), { size: 16, className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" })}
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
              {getIcon("Search") && React.createElement(getIcon("Search"), { size: 24, className: "text-primary" })}
            </div>
            <h3 className="mt-4 text-lg font-medium">No Menus Found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Try adjusting your search or add a new menu.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              {getIcon("Plus") && React.createElement(getIcon("Plus"), { size: 16, className: "mr-2" })}
              Add Menu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredMenus.map((menu) => {
            const IconComp = getIcon(menu.image);
            return (
              <motion.div
                key={menu.id || menu.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge>Menu</Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {getIcon("MoreHorizontal") && React.createElement(getIcon("MoreHorizontal"), { size: 16 })}
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
                            {getIcon("Trash") && React.createElement(getIcon("Trash"), { size: 14, className: "mr-2" })}
                            Delete Menu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-muted/20">
                        {IconComp ? React.createElement(IconComp, { size: 32 }) : (
                          <AvatarFallback className="text-lg">{menu.title?.charAt(0)}</AvatarFallback>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{menu.title}</h3>
                        <p className="text-sm text-muted-foreground">{menu.link}</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <div className="w-full flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {menu.updated_by ? `Updated by ${menu.updated_by}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">{menu.id ? `#${menu.id}` : ""}</div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {menuToDelete && (
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted/20">
                  {getIcon(menuToDelete.image)
                    ? React.createElement(getIcon(menuToDelete.image), { size: 18 })
                    : menuToDelete.title?.charAt(0)}
                </div>

                <div>
                  <p className="font-medium">{menuToDelete.title}</p>
                  <p className="text-sm text-muted-foreground">{menuToDelete.link}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
