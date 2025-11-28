import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  key: { type: String, required: true }, // имя файла в S3
  mimetype: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Media", MediaSchema);
