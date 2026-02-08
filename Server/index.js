import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/dbConfig.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";
import {
  getLeaderBoard,
  impactController,
} from "./controllers/ImpactController.js";
import reportRouter from "./Routes/ReportRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cookieParser());

// Increase payload size limit for Base64 images
app.use(express.json({ limit: '50mb' }));  // Increase from default 100kb
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/report", reportRouter);

app.get("/api/impact-data", impactController);
app.get("/api/leaderboard-data", getLeaderBoard);

app.get("/", (req, res, next) => {
  res.send("Hello World");
  next();
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
