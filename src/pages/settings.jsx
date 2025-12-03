
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Lock,
  Palette,
  Info,
  CreditCard,
  Sun,
  Moon,
  MoreVertical
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useTheme } from "../components/theme-provider";
import { useToast } from "../components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import PermissionMatrix from "../components/ui/PermissionMatrix";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [roleHeading, setRoleHeading] = useState([
    { name: "Admin", users: 0 },
    { name: "Principal", users: 0 },
    { name: "Teacher", users: 0 },
    { name: "Parent", users: 0 },
    { name: "Student", users: 0 },
    { name: "Accountant", users: 0 },
    { name: "Librarian", users: 0 },
  ]);
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const userData = JSON.parse(localStorage.getItem("edusync-user") || "{}");

  const [profile, setProfile] = useState({
    name: userData.name || "Admin User",
    email: userData.email || "admin@example.com",
    phone: userData.phone || "+1234567890",
    avatar: userData.avatar || "",
  });

  const [notifications, setNotifications] = useState({
    emailNewStudent: true,
    emailAttendanceAlert: true,
    pushGradeUpdates: false,
    pushEventReminders: true,
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (name) => {
    setNotifications({ ...notifications, [name]: !notifications[name] });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    const updatedUserData = { ...userData, ...profile };
    localStorage.setItem("edusync-user", JSON.stringify(updatedUserData));
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const saveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const changePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
      });
      return;
    }
    if (password.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "New password must be at least 6 characters long.",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // ✅ Add New Role Function
  const addNewRole = () => {
    if (!newRoleName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid role name.",
      });
      return;
    }

    const exists = roleHeading.some(
      (role) => role.name.toLowerCase() === newRoleName.toLowerCase()
    );
    if (exists) {
      toast({
        variant: "destructive",
        title: "Duplicate Role",
        description: "This role already exists.",
      });
      return;
    }

    const updatedRoles = [...roleHeading, { name: newRoleName, users: 0 }];
    setRoleHeading(updatedRoles);
    setNewRoleName("");
    setShowModal(false);

    toast({
      title: "Role Added",
      description: `The role "${newRoleName}" has been added successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Left Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Appearance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="theme-toggle"
                  className="flex flex-col space-y-1"
                >
                  <span>Theme</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Select light or dark mode.
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About EduSync</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Updated
                </span>
                <span className="text-sm font-medium">May 19, 2025</span>
              </div>
              <Button variant="link" className="p-0 h-auto">
                Privacy Policy
              </Button>
              <Button variant="link" className="p-0 h-auto">
                Terms of Service
              </Button>
            </CardContent>
          </Card>

          {/* Role Management */}
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>User Role & Permissions</CardTitle>
              <Button onClick={() => setShowModal(true)}>+ New Role</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg">
                  <div className="border-b p-3 font-medium">Roles</div>
                  <ul className="max-h-auto overflow-y-auto">
                    {roleHeading.map((role) => (
                      <li
                        key={role.name}
                        className={`flex justify-between items-center px-1 py-2 cursor-pointer ${
                          selectedRole === role.name
                            ? "bg-muted text-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <p
                          className="flex flex-row gap-2"
                          onClick={() => setSelectedRole(role.name)}
                        >
                          <span className="text-sm">{role.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {role.users}
                          </span>
                        </p>
                        <MoreVertical />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <PermissionMatrix role={selectedRole} />
                </div>
              </div>
            </CardContent>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 space-y-4">
                <div className="text-sm font-medium">Assign Role to Users</div>
                <div className="space-y-2">
                  <select className="w-full border rounded p-2 text-sm">
                    <option>Select role</option>
                    {roleHeading.map((item) => (
                      <option>{item.name}</option>
                    ))}
                  </select>
                  <Input placeholder="Search users" />
                  <Button className="w-full">Assign</Button>
                </div>
              </div>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="text-sm font-medium">Assign Role to Users</div>
                <div className="space-y-2">
                  <select className="w-full border rounded p-2 text-sm">
                    <option>Select role</option>
                    {roleHeading.map((item) => (
                      <option>{item.name}</option>
                    ))}
                  </select>
                  <Button className="w-full">Assign</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveProfile}>Save Profile</Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage your notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(notifications).map((key) => (
                  <div className="flex items-center justify-between" key={key}>
                    <Label htmlFor={key}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </Label>
                    <Switch
                      id={key}
                      checked={notifications[key]}
                      onCheckedChange={() => handleNotificationChange(key)}
                    />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotifications}>Save Notifications</Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={password.currentPassword}
                  onChange={handlePasswordChange}
                />
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                />
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={changePassword}>Change Password</Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Billing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Current Plan</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        You are on the <strong>Pro Plan</strong>. Renews July
                        19, 2025.
                      </p>
                      <Button variant="outline" size="sm">
                        Manage Subscription
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Payment Methods</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between border p-3 rounded-md">
                        <CreditCard className="h-5 w-5" />
                        <span>Visa ending in 1234</span>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        Add Payment Method
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ✅ Modal for Adding Role */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-96 p-6 space-y-4">
            <h2 className="text-xl font-bold">Add Role</h2>
            <Input
              placeholder="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={addNewRole}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
