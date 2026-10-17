import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food"
    },

    name: String,

    price: Number,

    quantity: Number
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    paymentMethod: {
      type: String,
      default: "Cash on delivery"
    },

    note: {
      type: String,
      default: ""
    },

    deliveryFee: {
      type: Number,
      default: 40
    },

    status: {
      type: String,

      enum: [
        "Received",
        "Preparing",
        "On the way",
        "Delivered",
        "Cancelled"
      ],

      default: "Received"
    }
  },

  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;