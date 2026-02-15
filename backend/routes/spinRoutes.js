import express from "express";
import { spinWheel } from "../controllers/spinController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/spin",authMiddleware,spinWheel);

export default router;
