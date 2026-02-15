// import mongoose  from "mongoose";

// export const connectDB=async()=>{
//     await mongoose.connect('mongodb+srv://asitamit28_db_user:uvxqg9BMxAtm5j4A@cluster0.ceg1vlt.mongodb.net/Cantten').then(()=>console.log("Db connceted"));

// }




import mongoose from "mongoose";

let isConnected = false; // serverless-safe cache

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Cantten"
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};
