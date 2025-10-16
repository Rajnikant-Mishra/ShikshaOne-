import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";

//import routes
import userRoutes from "./routes/User/userRoutes.js";
import roleRoutes from "./routes/Role/roleRoutes.js";

//grade router
import gradeRouters from "./routes/grade/gradeRoutes.js";

//student router
import studentRoutes from "./routes/student/studentRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api", roleRoutes);

//grade routes
app.use("/api", gradeRouters);

//student routes
app.use("/api/v1/student", studentRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
