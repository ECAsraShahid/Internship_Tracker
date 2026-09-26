import express from "express";
const router = express.Router();

import { signup, login } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {

    res.json({
      message: "Protected route accessed",
      user: req.user
    });

});

router.post("/signup", signup);
router.post("/login", login);

export default router;
