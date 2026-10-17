import mongoose from "mongoose";

const paymentOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    showQr: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);

const paymentSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "checkout"
    },
    qrCode: {
      type: String,
      default: null
    },
    paymentMethods: {
      type: [paymentOptionSchema],
      default: [
        { name: "Cash on delivery", enabled: true, showQr: false },
        { name: "UPI", enabled: true, showQr: true },
        { name: "Card", enabled: true, showQr: false },
        { name: "Demo QR", enabled: true, showQr: true }
      ]
    }
  },
  {
    timestamps: true
  }
);

const PaymentSettings = mongoose.model("PaymentSettings", paymentSettingsSchema);

export default PaymentSettings;
