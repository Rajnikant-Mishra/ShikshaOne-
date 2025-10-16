
// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { motion, AnimatePresence } from 'framer-motion';

// //for auth routes
// import { AuthProvider } from "./pages/contextsAuthsecurity/AuthContext";
// import ProtectedRoute from "./pages/contextsAuthsecurity/ProtectedRoute";
// import RedirectIfAuthenticated from "./pages/contextsAuthsecurity/RedirectIfAuthenticated";
// // Layouts
// import DashboardLayout from './components/layouts/dashboard-layout';

// // Pages
// import Dashboard from './pages/dashboard';
// import Students from '@/pages/students';
// import Teachers from '@/pages/teachers';
// import Classes from '@/pages/classes';
// import Attendance from '@/pages/attendance';
// import Grades from '@/pages/grades';
// import Calendar from '@/pages/calendar';
// import Settings from '@/pages/settings';
// import Login from '@/pages/login';
// import NotFound from '@/pages/not-found';

// function App() {
//   // Check if user is logged in (using localStorage for now)
//   const [isLoggedIn, setIsLoggedIn] = React.useState(
//     localStorage.getItem('edusync-user') !== null
//   );

//   const handleLogin = (userData) => {
//     localStorage.setItem('edusync-user', JSON.stringify(userData));
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('edusync-user');
//     setIsLoggedIn(false);
//   };

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <Routes>
//           {!isLoggedIn ? (
//             <Route path="*" element={<Login onLogin={handleLogin} />} />
//           ) : (
//             <>
//               <Route element={<DashboardLayout onLogout={handleLogout} />}>
//                 <Route path="/" element={<Dashboard />} />
//                 <Route path="/students" element={<Students />} />
//                 <Route path="/teachers" element={<Teachers />} />
//                 <Route path="/classes" element={<Classes />} />
//                 <Route path="/attendance" element={<Attendance />} />
//                 <Route path="/grades" element={<Grades />} />
//                 <Route path="/calendar" element={<Calendar />} />
//                 <Route path="/settings" element={<Settings />} />
//               </Route>
//               <Route path="*" element={<NotFound />} />
//             </>
//           )}
//         </Routes>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// export default App;


import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

// Authentication imports from the first code
import { AuthProvider } from "./components/contextsAuthsecurity/AuthContext";
import ProtectedRoute from "./components/contextsAuthsecurity/ProtectedRoute";
import RedirectIfAuthenticated from "./components/contextsAuthsecurity/RedirectIfAuthenticated";

// Layouts
import DashboardLayout from './components/layouts/dashboard-layout';

//role and users
import Roles from "./pages/roles";
import Users from "./pages/users";

// Pages
import Dashboard from './pages/dashboard';
import Students from './pages/students';
import Teachers from './pages/teachers';
import Classes from './pages/classes';
import Attendance from './pages/attendance';
import Grades from './pages/grades';
import Calendar from './pages/calendar';
import Settings from './pages/settings';
import Login from './pages/login';
import NotFound from './pages/not-found';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/calendar" element={<Calendar />} /> 
                <Route path="/role" element={<Roles />} />
                 <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;