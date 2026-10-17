import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Food from "../models/Food.js";
import mongoose from "mongoose";
import { getPaymentSettings } from "./paymentSettingsController.js";

const validOrderStatuses = new Set([
  "Received",
  "Preparing",
  "On the way",
  "Delivered",
  "Cancelled"
]);

const normalizeOrderStatus = (status) => {
  const value = typeof status === "string" ? status.trim() : "";
  if (!value) return "Received";

  const lookup = {
    received: "Received",
    preparing: "Preparing",
    "on the way": "On the way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return lookup[value.toLowerCase()] || value;
};

// CREATE ORDER

export const createOrder = async (
  req,
  res
) => {

  try {

    const {
      address,
      phone,
      paymentMethod = "Cash on delivery",
      note = ""
    } = req.body;

    const { paymentMethods } = await getPaymentSettings();
    if (!paymentMethods.some((method) => method.enabled && method.name === paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method"
      });
    }

    const cart =
      await Cart.findOne({
        user: req.user.id
      }).populate(
        "items.food"
      );


    if (!cart || cart.items.length === 0) {

      return res.status(400).json({
        message: "Cart is empty"
      });

    }


    let totalAmount = 40;


    const orderItems =
      cart.items.map(item => {

        const food = item.food;

        const price = food.price;

        totalAmount +=
          price * item.quantity;


        return {

          food: food._id,

          name: food.name,

          price,

          quantity:
            item.quantity

        };

      });


    const order =
      await Order.create({

        user: req.user.id,

        items: orderItems,

        totalAmount,

        address,

        phone,

        paymentMethod,

        note

      });


    cart.items = [];

    await cart.save();


    res.status(201).json({

      message:
        "Order placed successfully",

      order

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// USER ORDERS

export const getMyOrders = async (
  req,
  res
) => {

  try {

    const orders =
      await Order.find({
        user: req.user.id
      })
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1
      });


    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// ADMIN ALL ORDERS

export const getAllOrders = async (
  req,
  res
) => {

  try {

    const orders =
      await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1
      });


    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// UPDATE ORDER STATUS

export const updateOrderStatus =
  async (req, res) => {

    try {

      const {
        status
      } = req.body;

      const nextStatus = normalizeOrderStatus(status);

      if (!validOrderStatuses.has(nextStatus)) {
        return res.status(400).json({
          message: "Invalid order status"
        });
      }

      const order =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            status: nextStatus
          },

          {
            new: true
          }

        ).populate(
          "user",
          "name email"
        );


      if (!order) {

        return res.status(404).json({
          message: "Order not found"
        });

      }


      res.json(order);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

export const cancelMyOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID"
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        status: "Received"
      },
      {
        status: "Cancelled"
      },
      {
        new: true
      }
    ).populate("user", "name email");

    if (order) {
      return res.json(order);
    }

    const existingOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select("_id status");

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    return res.status(409).json({
      message: "This order can no longer be cancelled"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};