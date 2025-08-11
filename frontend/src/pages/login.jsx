// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { GraduationCap, Eye, EyeOff } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';

// const Login = ({ onLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       if (email && password) {
//         // Mock user data
//         const userData = {
//           id: '1',
//           name: 'Admin User',
//           email: email,
//           role: 'Administrator',
//           avatar: '',
//         };

//         toast({
//           title: 'Login successful',
//           description: 'Welcome back to EduSync!',
//         });

//         onLogin(userData);
//       } else {
//         toast({
//           variant: 'destructive',
//           title: 'Login failed',
//           description: 'Please enter valid credentials.',
//         });
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl"
//       >
//         <div className="p-8">
//           <div className="flex flex-col items-center space-y-2 text-center">
//             <div className="rounded-full bg-primary/10 p-3">
//               <GraduationCap className="h-10 w-10 text-primary" />
//             </div>
//             <h1 className="text-3xl font-bold">Welcome to EduSync</h1>
//             <p className="text-sm text-muted-foreground">
//               Sign in to access your school management dashboard
//             </p>
//           </div>
//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="admin@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password">Password</Label>
//                 <a
//                   href="#"
//                   className="text-xs text-primary hover:underline"
//                   onClick={(e) => e.preventDefault()}
//                 >
//                   Forgot password?
//                 </a>
//               </div>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </Button>
//           </form>
//           <div className="mt-6 text-center text-sm">
//             <p className="text-muted-foreground">
//               For demo purposes, you can use any email and password
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
import { useAuth } from "../components/contextsAuthsecurity/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../components/ApiConfig/ApiConfig";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Single input for email or student_id
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.clear();
        navigate("/");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send both email and student_id, letting backend decide based on input
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email: identifier.includes("@") ? identifier : null, // Assume email if contains '@'
        student_id: !identifier.includes("@") ? identifier : null, // Assume student_id otherwise
        password,
      });

      const { message, token, user, menus, roleDetails } = response.data;

      login(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("menus", JSON.stringify(menus));
      localStorage.setItem("roleDetails", JSON.stringify(roleDetails));

      toast({
        title: message || "Login successful",
        description: "Welcome back to EduSync",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: err.response?.data?.error || "Login failed",
        description: "", // Optional: keep empty or add additional info
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl"
      >
        <div className="p-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to EduSync</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your email or student ID
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Student ID</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="identifier"
                  type="text" // Use text to allow both email and student_id
                  placeholder="Enter your email or student ID"
                  value={identifier}
                  className="ps-10"
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      <Lock className="h-4 w-4" />
    </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                   className="ps-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {/* For demo purposes, you can use any email or student ID and password */}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
