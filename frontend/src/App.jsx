import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster"; // Optional but recommended

// Authentication
import { AuthProvider } from "./components/contextsAuthsecurity/AuthContext";
import ProtectedRoute from "./components/contextsAuthsecurity/ProtectedRoute";
import RedirectIfAuthenticated from "./components/contextsAuthsecurity/RedirectIfAuthenticated";

// Layouts
import DashboardLayout from "./components/layouts/dashboard-layout";

// Pages
import Roles from "./pages/roles/RoleList";
import Users from "./pages/users/UserList";
import UserForm from "./pages/users/UserForm";
import UserEdit from "./pages/users/UserEdit";

import MenuList from "./pages/menu/MenuList";
import MenuPermission from "./pages/menu-permission/Menu-permissionList";

import ClassList from "./pages/class/ClassList";
import SubjectList from "./pages/subject/SubjectList";

import Dashboard from "./pages/dashboard";
import Students from "./pages/student/studentsList";
import AddStudentForm from "./pages/student/studentForm";


import Teachers from "./pages/teachers";

import Classes from "./pages/classes";
import Attendance from "./pages/attendance/attendance";
import Grades from "./pages/grades";
import Calendar from "./pages/calendar";
import Settings from "./pages/settings";
import Login from "./pages/login";
import NotFound from "./pages/not-found";

// activity logs
import ActivityLogs from "./pages/activitylogs/ActivitylogsList";

//exams
import ExamList from "./pages/exams/ExamList";
import ExamForm from "./pages/exams/ExamForm";
import ExamEdit from "./pages/exams/ExamEdit";

//fees
import FeesList from "./pages/fees/FeesList";

//leave
import LeaveList from "./pages/leavemanagements/LeaveList";

//setting system
import SettingsystemList from "./pages/setting-system/SettingsystemList";

//teacher
import TeacherList from "./pages/teacher/TeacherList";
import TeacherForm from "./pages/teacher/TeacherForm";
import TeacherEdit from "./pages/teacher/TeacherEdit";

//time table
import TimeTableList from "./pages/timetables/TimeTableList";

// Create QueryClient (only once)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen bg-background"
            >
              <Routes>
                <Route
                  path="/"
                  element={<RedirectIfAuthenticated element={<Login />} />}
                />

                <Route
                  element={<ProtectedRoute element={<DashboardLayout />} />}
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/students/add" element={<AddStudentForm />} />
                  <Route path="/class" element={<ClassList />} />
                  <Route path="/subject" element={<SubjectList />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/classes" element={<Classes />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/grades" element={<Grades />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/role" element={<Roles />} />

                  {/* //user */}
                  <Route path="/users" element={<Users />} />
                  <Route path="/user/create" element={<UserForm />} />
                  <Route path="/user/edit/:id" element={<UserEdit />} />

                  <Route path="/settings" element={<Settings />} />
                  <Route path="/menu-assign" element={<MenuList />} />
                  <Route path="/permission-menu" element={<MenuPermission />} />

                  <Route path="/logs-activity" element={<ActivityLogs />} />

                  {/* //exam */}
                  <Route path="/exam" element={<ExamList/>} />
                  <Route path="/exam/create" element={<ExamForm/>} />  
                  <Route path="/exam/edit/:id" element={<ExamEdit/>} />


                  <Route path="/fee" element={<FeesList />} />
                  <Route path="/leave" element={<LeaveList />} />
                  <Route
                    path="/setting-system"
                    element={<SettingsystemList />}
                  />

                  {/* //teacher */}
                  <Route path="/teacher/add" element={<TeacherForm />} />  
                  <Route path="/teacher" element={<TeacherList />} /> 
                   <Route path="/teacher/edit/:id" element={<TeacherEdit/>} />


                  <Route path="/time-table" element={<TimeTableList />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>

          {/* Toast notifications (for success/error messages) */}
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
