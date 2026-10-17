import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      default: ""
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    available: {
      type: Boolean,
      default: true
    },
    popular: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;