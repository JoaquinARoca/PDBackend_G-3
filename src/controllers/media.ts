import { Request, Response } from "express";
import {
  uploadToCloudinary,
  saveMedia,
  getMediaByInstruccion,
  deleteMedia,
} from "../services/media.js";
import { Types } from "mongoose";

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { instruccionId } = req.body;
    if (!instruccionId || !Types.ObjectId.isValid(instruccionId)) {
      return res.status(400).json({ message: "Valid instruccionId is required" });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.buffer);

    const media = await saveMedia({
      url,
      publicId,
      type: req.file.mimetype.startsWith("video") ? "video" : "image",
      instruccionId: new Types.ObjectId(instruccionId as string),
    });

    res.status(201).json(media);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Upload failed", error: msg });
  }
};

export const getMedia = async (req: Request, res: Response) => {
  try {
    const instruccionId = req.params.instruccionId as string;
    const media = await getMediaByInstruccion(instruccionId);
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Error fetching media" });
  }
};

export const removeMedia = async (req: Request, res: Response) => {
  try {
    const publicId = req.params.publicId as string;
    await deleteMedia(publicId);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Delete failed", error: msg });
  }
};
