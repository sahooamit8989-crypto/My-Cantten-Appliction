// import mongoose  from "mongoose";

// export const connectDB=async()=>{
//     await mongoose.connect('mongodb+srv://asitamit28_db_user:uvxqg9BMxAtm5j4A@cluster0.ceg1vlt.mongodb.net/Cantten').then(()=>console.log("Db connceted"));

// }




// import mongoose from "mongoose";

// let isConnected = false; // serverless-safe cache

// export const connectDB = async () => {
//   if (isConnected) {
//     return;
//   }

//   if (!process.env.MONGODB_URI) {
//     throw new Error("MONGODB_URI is not defined");
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "Cantten"
//     });

//     isConnected = db.connections[0].readyState;
//     console.log("✅ MongoDB connected");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     throw error;
//   }
// };














import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "Cantten",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
