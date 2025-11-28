import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import readingRoutes from "./routes/readingRoutes.js";
import listeningRoutes from "./routes/listeningRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // 👈 добавляем

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/tests", readingRoutes);
app.use("/listening", listeningRoutes);
app.use("/upload", uploadRoutes); // 👈 вот это важное


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
