import multer from "multer";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import Media from "../models/media.js";
import { Types } from "mongoose";

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadToCloudinary = (buffer: Buffer): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "pd-g3", resource_type: "auto" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

export const saveMedia = async (data: {
  url: string;
  publicId: string;
  type: "image" | "video";
  instruccionId: Types.ObjectId;
}) => {
  return await Media.create(data);
};

export const getMediaByInstruccion = async (instruccionId: string) => {
  return await Media.find({ instruccionId }).sort({ createdAt: -1 });
};

export const deleteMedia = async (publicId: string) => {
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  if (result.result !== "ok") throw new Error(`Cloudinary: ${result.result} (publicId: ${publicId})`);
  return await Media.findOneAndDelete({ publicId });
};
