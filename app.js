import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
dotenv.config({ path: "backend/config/config.env" });
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js"
import sendResponse from "./middlewares/sendResponse.js"

// Connecting to database
connectDatabase();

app.use(express.json());
app.use(cookieParser())
app.use(sendResponse);

// Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js"

app.use("/", productRoutes);
app.use("/", authRoutes);
app.use("/", orderRoutes);
app.use(errorHandler);


const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT}`
  );
});
