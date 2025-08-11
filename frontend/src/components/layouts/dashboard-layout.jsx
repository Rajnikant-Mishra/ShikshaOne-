import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  ChevronDown,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
  X,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  UserPen,
  UserRoundPen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "../ApiConfig/ApiConfig";
import { useAuth } from "../../components/contextsAuthsecurity/AuthContext";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const [profileData, setProfileData] = useState({});

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("edusync-user") || "{}");

  // Load profile data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setProfileData(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  //logout section
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        if (logout) logout(); // check if it's defined before calling
        navigate("/");
      } else {
        toast({
          title: "Logout failed",
          description: "Something went wrong while logging out.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: "An unexpected error occurred.",
        status: "error",
      });
    }
  };

  const sidebarLinks = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      path: "/students",
      label: "Students",
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: "/teachers",
      label: "Teachers",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      path: "/classes",
      label: "Classes",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: "/attendance",
      label: "Attendance",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      path: "/grades",
      label: "Grades",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      path: "/calendar",
      label: "Calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      path: "/role",
      label: "Roles",
      icon: <UserPen className="h-5 w-5" />,
    },
    {
      path: "/users",
      label: "Users",
      icon: <UserRoundPen className="h-5 w-5" />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-all duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
        initial={false}
        animate={{
          width: isSidebarOpen ? 256 : 0,
          opacity: isSidebarOpen ? 1 : 0,
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EduSync</span>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "sidebar-item",
                    location.pathname === link.path && "active"
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={userData.avatar} />
                <AvatarFallback>
                  {userData.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {userData.name || "Admin User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {userData.role || "Administrator"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>
                      {profileData.username?.charAt(0) || "U"}                                                  
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex">
                    {/* {userData.name || "Admin User"} */}
                    {profileData.username || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>                   
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
