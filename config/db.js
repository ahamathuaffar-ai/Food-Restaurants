import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is required. Add your MongoDB Atlas connection string to the environment.");
  }

  connectionPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      connectionPromise = undefined;
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
};

export default connectDB;