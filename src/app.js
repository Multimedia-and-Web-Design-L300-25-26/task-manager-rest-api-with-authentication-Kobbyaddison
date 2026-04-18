import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import connectDB, { closeDB } from "./config/db.js";

// load environment variables and establish database connection early
dotenv.config();

// ensure we have a secret for signing tokens, default for tests/development
if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET not defined, using default secret");
  process.env.JWT_SECRET = "defaultsecret";
}

// top-level await to guarantee DB connection before app is used
await connectDB();

// make sure we clean up the database connection during tests or when exiting
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});
process.on("exit", async () => {
  await closeDB();
});

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;