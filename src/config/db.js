import mongoose from "mongoose";

// use mongodb-memory-server during tests if no URI provided
let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // when running tests we default to an in‑memory mongo to avoid external dependencies
    if (process.env.NODE_ENV === "test" && !uri) {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    // fallback to a local mongo instance if still undefined
    if (!uri) {
      uri = "mongodb://127.0.0.1:27017/taskmanager";
    }

    // mongoose v7+ handles options automatically
    await mongoose.connect(uri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed", error);
    // do not call process.exit in tests; rethrow so caller can decide
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

// to allow shutting down the in-memory server in tests if desired
export const closeDB = async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
};

export default connectDB;