import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controller/categroyController.js";
import {
  protect,
  adminOnly
} from "../middlewere/authMiddlewrer.js";

const router = express.Router();


router.get(
  "/",
  getCategories
);


router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);


export default router;