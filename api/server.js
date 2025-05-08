import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import userRouter from "./routes/user.routes.js"; // Importing routes correctly
import taskRouter from "./routes/task.routes.js";
import adminRouter from "./routes/admin.routes.js";
import moderatorRouter from "./routes/moderator.routes.js";
dotenv.config();
const app = express();

// CORS ko configure karenge
app.use(
  cors({
    // origin: "http://localhost:3000",
    // frontend ka URL (e.g., http://localhost:5173)
    origin: "https://stamurai-task.vercel.app",
    credentials: true, // Allow credentials like cookies
  })
);

// Middleware for parsing JSON data
app.use(express.json()); // Middleware for parsing JSON data
app.use(cookieParser()); // Cookie parsing middleware

// Use the routes with /api/v1 prefix
app.use("/api/users", userRouter); // Use userRouter for handling routes
app.use("/api/tasks", taskRouter);
app.use("/api/admin", adminRouter);

// Moderator Router
app.use("/api/moderators", moderatorRouter);

// Default port for the server
const PORT = process.env.PORT || 8000;

// Database call and starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
