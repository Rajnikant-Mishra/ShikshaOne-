// routes/attendance.routes.js
import express from "express";
import controller from "../../controllers/attendance/attendance.controller.js";

const router = express.Router();


router.post("/bulk", controller.bulkUpload);


export default router;
