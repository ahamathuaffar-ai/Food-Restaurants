import express from "express";
import {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood
} from "../controller/FoodController.js";
import {
  protect,
  adminOnly
} from "../middlewere/authMiddlewrer.js";

const router = express.Router();


router.get(
  "/",
  getFoods
);


router.get(
  "/:id",
  getFood
);


router.post(
  "/",
  protect,
  adminOnly,
  createFood
);


router.put(
  "/:id",
  protect,
  adminOnly,
  updateFood
);


router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteFood
);


export default router;