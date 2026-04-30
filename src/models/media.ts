import { Schema, model, Types } from "mongoose";

export interface IMedia {
  url: string;
  publicId: string;
  type: "image" | "video";
  instruccionId: Types.ObjectId;
  createdAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    instruccionId: { type: Schema.Types.ObjectId, ref: "Instrucciones", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IMedia>("Media", mediaSchema);
