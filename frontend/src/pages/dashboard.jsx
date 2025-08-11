
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Bell, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  // Mock data
  const stats = [
    { 
      title: 'Total Students', 
      value: '1,234', 
      change: '+12%', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      title: 'Total Teachers', 
      value: '64', 
      change: '+4%', 
      icon: <GraduationCap className="h-5 w-5" /> 
    },
    { 
      title: 'Active Classes', 
      value: '42', 
      change: '+2%', 
      icon: <BookOpen className="h-5 w-5" /> 
    },
    { 
      title: 'Events This Month', 
      value: '8', 
      change: '+3', 
      icon: <Calendar className="h-5 w-5" /> 
    },
  ];

  const recentActivities = [
    { 
      id: 1, 
      title: 'New student enrolled', 
      description: 'John Doe has been enrolled in Class 10A', 
      time: '2 hours ago',
      icon: <Users className="h-4 w-4" />,
    },
    { 
      id: 2, 
      title: 'Attendance updated', 
      description: 'Ms. Johnson updated attendance for Class 8B', 
      time: '3 hours ago',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    { 
      id: 3, 
      title: 'Exam results published', 
      description: 'Mid-term exam results for Grade 9 published', 
      time: '5 hours ago',
      icon: <BookOpen className="h-4 w-4" />,
    },
    { 
      id: 4, 
      title: 'Parent meeting scheduled', 
      description: 'Parent-teacher meeting scheduled for next Friday', 
      time: '1 day ago',
      icon: <Calendar className="h-4 w-4" />,
    },
  ];

  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Annual Sports Day', 
      date: 'June 15, 2025', 
      status: 'Upcoming' 
    },
    { 
      id: 2, 
      title: 'Science Exhibition', 
      date: 'June 22, 2025', 
      status: 'Upcoming' 
    },
    { 
      id: 3, 
      title: 'Final Exams', 
      date: 'July 10-20, 2025', 
      status: 'Planning' 
    },
  ];

  const notifications = [
    { 
      id: 1, 
      title: 'System Update', 
      description: 'The system will be updated tonight at 2 AM', 
      type: 'info' 
    },
    { 
      id: 2, 
      title: 'Low Attendance Alert', 
      description: 'Class 7A has attendance below 80% this week', 
      type: 'warning' 
    },
    { 
      id: 3, 
      title: 'Fee Payment Reminder', 
      description: '120 students have pending fee payments', 
      type: 'alert' 
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your school.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="rounded-full bg-primary/10 p-1 text-primary">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activities across your school
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {activity.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add New Student
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <GraduationCap className="mr-2 h-4 w-4" />
                Add New Teacher
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Create Class
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Event
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Notifications</h3>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      {notification.type === 'warning' ? (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      ) : notification.type === 'alert' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Bell className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="text-sm font-medium">
                        {notification.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Events scheduled for the coming weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="extracurricular">Extracurricular</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant={event.status === 'Planning' ? 'outline' : 'default'}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.date}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="academic">
              <div className="rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium">No academic events</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no academic events scheduled at the moment.
                </p>
                <Button className="mt-4">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Event
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="extracurricular">
              <div className="rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium">No extracurricular events</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no extracurricular events scheduled at the moment.
                </p>
                <Button className="mt-4">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Event
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
