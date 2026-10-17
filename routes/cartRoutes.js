import express from "express";

import {
  getCart,
  addToCart,
  updateCart,
  clearCart
} from "../controller/cartController.js";

import {
  protect
} from "../middlewere/authMiddlewrer.js";

const router = express.Router();


router.get(
  "/",
  protect,
  getCart
);


router.post(
  "/",
  protect,
  addToCart
);


router.put(
  "/",
  protect,
  updateCart
);


router.delete(
  "/",
  protect,
  clearCart
);


export default router;