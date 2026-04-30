import { Router } from "express";
import { upload } from "../services/media.js";
import { uploadMedia, getMedia, removeMedia } from "../controllers/media.js";

const router = Router();

router.post("/media", upload.single("file"), uploadMedia);
router.get("/media/:instruccionId", getMedia);
router.delete("/media/:publicId", removeMedia);

export default router;
