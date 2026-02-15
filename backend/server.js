




// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";

// import { connectDB } from "./config/db.js";
// import foodRouter from "./routes/foodRoutes.js";
// import userRoute from "./routes/userRoutes.js";
// import cartRouter from "./routes/cartRoutes.js";
// import orderRouter from "./routes/orderRoutes.js";
// import searchRouter from "./routes/searchRoutes.js";
// import offerRoutes from "./routes/offerRoutes.js";
// import offerMailRouter from "./routes/offerMailRouter.js";
// import spinRoutes from "./routes/spinRoutes.js";
// import rewardRoutes from "./routes/rewardRoutes.js";
// import adminReward from "./routes/adminRewardClaimRoutes.js";
// import userReward from "./routes/userRewardRoutes.js";
// import { errorMiddleware } from "./middlewares/error.js";

// const app = express();
// const PORT = process.env.PORT || 4000;
// connectDB()
// // middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use( cors());



// // routes
// app.use("/api/food", foodRouter);
// app.use("/api/food", searchRouter);
// app.use("/api/v1/auth", userRoute);
// app.use("/api/cart", cartRouter);
// app.use("/api/order", orderRouter);
// app.use("/images", express.static("uploads"));
// app.use("/api/offers",offerRoutes);
// app.use("/api",spinRoutes);


// app.use("/api/admin",rewardRoutes);
// app.use("/api/user",userReward );
// app.use("/api/adminreward",adminReward);


// app.use("/api/offer-mail", offerMailRouter);
// app.get("/", (req, res) => {
//   res.send("API working 🚀");
// });

// /* ---------------- LOCAL DEV ONLY ---------------- */
// if (process.env.NODE_ENV !== "production") {
//   app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
//   });
// }


// app.use(errorMiddleware);
// /* ---------------- VERCEL ---------------- */
// export default app;














import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoutes.js";
import userRoute from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import searchRouter from "./routes/searchRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import offerMailRouter from "./routes/offerMailRouter.js";
import spinRoutes from "./routes/spinRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import adminReward from "./routes/adminRewardClaimRoutes.js";
import userReward from "./routes/userRewardRoutes.js";

import { errorMiddleware } from "./middlewares/error.js";

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(cookieParser());
app.use(cors());

/* ================= DB CONNECTION (SERVERLESS SAFE) ================= */
/*
   This ensures MongoDB connects when a request comes in,
   not at file load time.
*/
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

/* ================= ROUTES ================= */

app.use("/api/food", foodRouter);
app.use("/api/food", searchRouter);
app.use("/api/v1/auth", userRoute);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/offers", offerRoutes);
app.use("/api", spinRoutes);

app.use("/api/admin", rewardRoutes);
app.use("/api/user", userReward);
app.use("/api/adminreward", adminReward);

app.use("/api/offer-mail", offerMailRouter);

app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).send("API working 🚀");
});

/* ================= ERROR HANDLER ================= */

app.use(errorMiddleware);

/* ================= LOCAL DEVELOPMENT ================= */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

/* ================= EXPORT FOR VERCEL ================= */

export default app;






















