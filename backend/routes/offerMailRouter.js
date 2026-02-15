import express from "express";
import { sendOfferMailToAllUsers } from "../controllers/offerMailController.js";
// import adminMiddleware from "../middlewares/adminMiddleware.js";

const offerMailRouter = express.Router();

// Only admin can send broadcast mail
offerMailRouter.post("/send", sendOfferMailToAllUsers);

export default offerMailRouter;
