import { upload } from "../config/multer.config.js";

export const studentUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "birth_certificate", maxCount: 1 },
  { name: "id_proof", maxCount: 1 },
]);
