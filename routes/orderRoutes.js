import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder
} from "../controller/orderController.js";
import {
  protect,
  adminOnly
} from "../middlewere/authMiddlewrer.js";

const router = express.Router();


router.post(
  "/",
  protect,
  createOrder
);


router.get(
  "/my",
  protect,
  getMyOrders
);


router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);

router.put(
  "/:id/cancel",
  protect,
  cancelMyOrder
);


router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);


export default router;