import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import logger from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 3001;

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err);
  process.exit(1);
});
