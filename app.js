import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

import trackerRoutes from "./backend/routes/trackerRoutes.js";
import connectDB from "./backend/config/db.js";
import authRoutes from "./backend/routes/authRoutes.js";

// __dirname isn't available in ES modules, so we rebuild it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/users", trackerRoutes);
app.use("/api/auth", authRoutes);

// Serve the frontend (static site)
app.use(express.static(path.join(__dirname, "frontend")));

// Any non-API route falls back to the frontend app
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

export default app;
