import { Router } from "express";
import multer from "multer";
import { getResumeJson } from "../controller/resume";
const router = Router();
const upload = multer({ dest: "uploads/" });
//@ts-ignore
router.post("/api/upload", upload.single("file"), getResumeJson);
export { router };
