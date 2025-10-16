import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette, Info, CreditCard, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useTheme } from '../components/theme-provider';
import { useToast } from '../components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const userData = JSON.parse(localStorage.getItem('edusync-user') || '{}');

  const [profile, setProfile] = useState({
    name: userData.name || 'Admin User',
    email: userData.email || 'admin@example.com',
    phone: userData.phone || '+1234567890',
    avatar: userData.avatar || '',
  });

  const [notifications, setNotifications] = useState({
    emailNewStudent: true,
    emailAttendanceAlert: true,
    pushGradeUpdates: false,
    pushEventReminders: true,
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
    localStorage.setItem('edusync-user', JSON.stringify(updatedUserData));
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
    setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };
  

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="flex flex-col space-y-1">
                  <span>Theme</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Select light or dark mode.
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-5 w-5" />
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
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
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">May 19, 2025</span>
              </div>
              <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
              <Button variant="link" className="p-0 h-auto">Terms of Service</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
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
                    <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveProfile}>Save Profile</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNewStudent">Email for new student enrollment</Label>
                  <Switch
                    id="emailNewStudent"
                    checked={notifications.emailNewStudent}
                    onCheckedChange={() => handleNotificationChange('emailNewStudent')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAttendanceAlert">Email for attendance alerts</Label>
                  <Switch
                    id="emailAttendanceAlert"
                    checked={notifications.emailAttendanceAlert}
                    onCheckedChange={() => handleNotificationChange('emailAttendanceAlert')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushGradeUpdates">Push notifications for grade updates</Label>
                  <Switch
                    id="pushGradeUpdates"
                    checked={notifications.pushGradeUpdates}
                    onCheckedChange={() => handleNotificationChange('pushGradeUpdates')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushEventReminders">Push notifications for event reminders</Label>
                  <Switch
                    id="pushEventReminders"
                    checked={notifications.pushEventReminders}
                    onCheckedChange={() => handleNotificationChange('pushEventReminders')}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotifications}>Save Notifications</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" name="currentPassword" type="password" value={password.currentPassword} onChange={handlePasswordChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" name="newPassword" type="password" value={password.newPassword} onChange={handlePasswordChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={password.confirmPassword} onChange={handlePasswordChange} />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={changePassword}>Change Password</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription and payment methods.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Current Plan</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-sm">You are currently on the <span className="font-semibold text-primary">Pro Plan</span>.</p>
                      <p className="text-xs text-muted-foreground">Renews on July 19, 2025</p>
                      <Button variant="outline" size="sm">Manage Subscription</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Payment Methods</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5"/>
                          <span className="text-sm">Visa ending in 1234</span>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                      <Button variant="outline" size="sm">Add New Payment Method</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Billing History</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">No billing history available yet.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;