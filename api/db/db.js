import mongoose from "mongoose";

// DB connection ka function define kar rahe hai
async function connectDB() {
  try {
    // moongoose se mongoDB se connect ho rahe hai
    // url aur db name ko .env se le rahe hai
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
    // agar connection ho gaya to ye message show hoga 
    console.log(`MongoDB connected at ${connection.connection.host}`)
  } catch (error) {
    console.log("Database Connection Error: ", error);
  }
}

export default connectDB;
