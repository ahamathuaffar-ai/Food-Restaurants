
import PaymentSettings from "../models/PaymentSettings.js";

const defaultPaymentMethods = [
  { name: "Cash on delivery", enabled: true, showQr: false },
  { name: "UPI", enabled: true, showQr: true },
  { name: "Card", enabled: true, showQr: false },
  { name: "Demo QR", enabled: true, showQr: true }
];
const maxQrBytes = 2 * 1024 * 1024;

const isValidQrImage = (value) => {
  if (value === null) return true;
  if (typeof value !== "string") return false;

  const match = value.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) return false;

  const image = Buffer.from(match[2], "base64");
  if (!image.length || image.length > maxQrBytes) return false;

  if (match[1] === "png") {
    return image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (match[1] === "jpeg") {
    return image[0] === 255 && image[1] === 216 && image[2] === 255;
  }
  return image.subarray(0, 4).toString() === "RIFF"
    && image.subarray(8, 12).toString() === "WEBP";
};

const getPaymentSettings = async () => {
  const settings = await PaymentSettings.findOne({ key: "checkout" }).lean();
  return settings || {
    qrCode: null,
    paymentMethods: defaultPaymentMethods
  };
};

export const readPaymentSettings = async (req, res) => {
  try {
    return res.json(await getPaymentSettings());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const savePaymentSettings = async (req, res) => {
  try {
    const { qrCode, paymentMethods } = req.body;

    if (!isValidQrImage(qrCode)) {
      return res.status(400).json({
        message: "Upload a valid PNG, JPEG, or WebP QR image under 2 MB"
      });
    }

    if (!Array.isArray(paymentMethods) || paymentMethods.length < 1 || paymentMethods.length > 12) {
      return res.status(400).json({
        message: "Add between 1 and 12 payment methods"
      });
    }

    const normalizedMethods = [];
    const names = new Set();
    for (const method of paymentMethods) {
      if (!method || typeof method.name !== "string" || typeof method.enabled !== "boolean" || typeof method.showQr !== "boolean") {
        return res.status(400).json({
          message: "Each payment method needs a name and valid settings"
        });
      }

      const name = method.name.trim();
      const normalizedName = name.toLowerCase();
      if (!name || name.length > 40 || names.has(normalizedName)) {
        return res.status(400).json({
          message: "Payment method names must be unique and 1 to 40 characters"
        });
      }
      names.add(normalizedName);
      normalizedMethods.push({
        name,
        enabled: method.enabled,
        showQr: method.showQr
      });
    }

    if (!normalizedMethods.some((method) => method.enabled)) {
      return res.status(400).json({
        message: "Enable at least one payment method"
      });
    }

    const settings = await PaymentSettings.findOneAndUpdate(
      { key: "checkout" },
      {
        $set: {
          qrCode,
          paymentMethods: normalizedMethods
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { defaultPaymentMethods, getPaymentSettings };
