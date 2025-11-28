import express from "express";
import multer from "multer";
import { s3 } from "../services/s3.js";
import Media from "../models/Media.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types"; // 👈 ЭТО нужно

const upload = multer();
const router = express.Router();

// === CREATE — загрузить файл ===
// === UPLOAD ===
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Файл не найден" });

    let buffer = file.buffer;
    let original = file.originalname.toLowerCase();
    let filename = Date.now() + "-" + original;

    // ===== MIME FIX =====
    let contentType = "application/octet-stream";

    if (original.endsWith(".jpg") || original.endsWith(".jpeg")) contentType = "image/jpeg";
    else if (original.endsWith(".png")) contentType = "image/png";
    else if (original.endsWith(".webp")) contentType = "image/webp";
    else if (original.endsWith(".mp3")) contentType = "audio/mpeg";
    else if (original.endsWith(".wav")) contentType = "audio/wav";
    else if (original.endsWith(".ogg")) contentType = "audio/ogg";

    // AAC → M4A
    else if (original.endsWith(".aac")) {
      filename = filename.replace(".aac", ".m4a");
      contentType = "audio/mp4";
    }

    // ===== UPLOAD =====
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.SCW_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read",                // ← ← ← ВОТ ЭТО ДЕЛАЕТ ФАЙЛ ПУБЛИЧНЫМ
      })
    );

    const url = `https://s3.pl-waw.scw.cloud/${process.env.SCW_BUCKET}/${filename}`;

    const media = await Media.create({
      url,
      key: filename,
      mimetype: contentType,
    });

    res.json(media);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Ошибка загрузки" });
  }
});



// === READ — список файлов ===
router.get("/", async (req, res) => {
  const list = await Media.find().sort({ createdAt: -1 });
  res.json(list);
});

// === DELETE — удалить файл ===
router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Не найден" });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.SCW_BUCKET,
        Key: media.key,
      })
    );

    await media.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Ошибка удаления" });
  }
});

export default router;
