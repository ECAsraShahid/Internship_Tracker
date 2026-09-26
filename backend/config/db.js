import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/internship-tracker"
    );

    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Connection Error", err);
  }
};

export default connectDB;
