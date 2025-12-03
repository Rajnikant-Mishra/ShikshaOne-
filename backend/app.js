// // ✅ Core Imports
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import morgan from "morgan";
// import winston from "winston";
// import errorHandler from "./middlewares/errorHandler.js";

// // ✅ Route Imports
// import userRoutes from "./routes/User/userRoutes.js";
// import roleRoutes from "./routes/Role/roleRoutes.js";
// import studentClassRoutes from "./routes/class/studentClass.routes.js";
// import subjectRoutes from "./routes/subject/subject.routes.js";
// import gradeRouters from "./routes/grade/gradeRoutes.js";
// import menuRoutes from "./routes/Menu/menuRoutes.js";
// import rolemenuRoutes from "./routes/configuration/role_menuRoutes.js";

// //stduent
// import studentRoutes from "./routes/student/student.routes.js";

// import attendanceRoutes from "./routes/attendance/attendance.routes.js";

// const app = express();

// // ✅ --- Winston Logger Setup (Production Logging) ---
// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: "logs/error.log", level: "error" }),
//     new winston.transports.File({ filename: "logs/combined.log" }),
//   ],
// });

// // ✅ --- Global Security Middlewares ---
// app.use(helmet()); // Secure HTTP headers

// // 🧹 --- Custom XSS Sanitization Middleware (replaces xss-clean) ---
// // app.use((req, res, next) => {
// //   // sanitize query params
// //   if (req.query) {
// //     for (const key in req.query) {
// //       if (typeof req.query[key] === "string") {
// //         req.query[key] = xss(req.query[key]);
// //       }
// //     }
// //   }

// //   // sanitize request body
// //   if (req.body) {
// //     for (const key in req.body) {
// //       if (typeof req.body[key] === "string") {
// //         req.body[key] = xss(req.body[key]);
// //       }
// //     }
// //   }

// //   // sanitize headers
// //   if (req.headers) {
// //     for (const key in req.headers) {
// //       if (typeof req.headers[key] === "string") {
// //         req.headers[key] = xss(req.headers[key]);
// //       }
// //     }
// //   }

// //   next();
// // });

// // ✅ --- Rate Limiting ---
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: "Too many requests, please try again later.",
// });
// app.use(limiter);

// // ✅ --- CORS Configuration ---
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// // ✅ --- Body Parsers ---
// app.use(express.json());
// app.use(bodyParser.json());

// // ✅ --- Request Logging ---
// app.use(
//   morgan("combined", {
//     stream: {
//       write: (message) => logger.info(message.trim()),
//     },
//   })
// );

// // ✅ --- API Routes ---
// app.use("/api/v1/users", userRoutes);
// app.use("/api", roleRoutes);
// app.use("/api/student-class", studentClassRoutes);
// app.use("/api/subjects", subjectRoutes);
// app.use("/api", gradeRouters);

// app.use("/uploads", express.static("uploads"));
// app.use("/api/students", studentRoutes);

// app.use("/api/menu", menuRoutes);
// app.use("/api/menurole", rolemenuRoutes);

// app.use("/api/attendance", attendanceRoutes);

// // ✅ --- Global Error Handler ---
// app.use(errorHandler);

// // ✅ --- Server Health Check Route ---
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "ERP Backend Running Securely 🚀" });
// });

// export default app;




// ✅ Core Imports
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import winston from "winston";
import xss from "xss";
import errorHandler from "./middlewares/errorHandler.js";
import path from "path";

// ✅ Route Imports
import userRoutes from "./routes/User/userRoutes.js";
import roleRoutes from "./routes/Role/roleRoutes.js";
import studentClassRoutes from "./routes/class/studentClass.routes.js";
import subjectRoutes from "./routes/subject/subject.routes.js";
import gradeRouters from "./routes/grade/gradeRoutes.js";
import menuRoutes from "./routes/Menu/menuRoutes.js";
import rolemenuRoutes from "./routes/configuration/role_menuRoutes.js";
import studentRoutes from "./routes/student/student.routes.js";
import attendanceRoutes from "./routes/attendance/attendance.routes.js";

const app = express();

// ✅ --- Winston Logger Setup ---
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// ✅ --- Global Security Middlewares ---
app.use(helmet()); // Secure HTTP headers

// 🧹 --- XSS Sanitization for JSON / Query Only ---
app.use((req, res, next) => {
  const contentType = req.headers["content-type"];

  // Skip sanitization for file uploads
  if (contentType && contentType.includes("multipart/form-data")) return next();

  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  next();
});

// ✅ --- Rate Limiting ---
app.use(
  rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later.",
  })
);

// ✅ --- CORS ---
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ --- Body Parsers ---
app.use(express.json());
app.use(bodyParser.json());

// ✅ --- Request Logging ---
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ✅ --- Static Folder for Uploads ---
// app.use("/uploads", express.static("uploads"));

// THIS LINE FIXES EVERYTHING
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ --- API Routes ---
app.use("/api/v1/users", userRoutes);
app.use("/api", roleRoutes);
app.use("/api/student-class", studentClassRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api", gradeRouters);
app.use("/api/students", studentRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/menurole", rolemenuRoutes);
app.use("/api/attendance", attendanceRoutes);

// ✅ --- Global Error Handler ---
app.use(errorHandler);

// ✅ --- Health Check ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "ERP Backend Running Securely 🚀" });
});

export default app;
