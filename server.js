import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./database/connectDB.js";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 8000;

// Connect to the database
async function startServer() {
  try {
    await connectDB(); // connect to DB
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🔥 Error starting server:", err.message);
    process.exit(1);
  }
}

startServer();