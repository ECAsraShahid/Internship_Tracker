import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getTrackers,
  getTrackerById,
  createTracker,
  updateTracker,
  deleteTracker,
} from "../controllers/trackerController.js";

const router = express.Router();

router.get("/", authMiddleware, getTrackers);

router.get("/:id", authMiddleware, getTrackerById);

router.post("/", authMiddleware, createTracker);

router.put("/:id", authMiddleware, updateTracker);

router.delete("/:id", authMiddleware, deleteTracker);

export default router;
