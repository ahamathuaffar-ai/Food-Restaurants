import express from "express";
import {
  readPaymentSettings,
  savePaymentSettings
} from "../controller/paymentSettingsController.js";
import { adminOnly, protect } from "../middlewere/authMiddlewrer.js";

const router = express.Router();

router.get("/", readPaymentSettings);
router.put("/", protect, adminOnly, savePaymentSettings);

export default router;
