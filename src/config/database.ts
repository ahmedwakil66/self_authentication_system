import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME,
    });
    console.log("MongoDB Connected");
    mongoose.connection.on('error', err => {
      console.error("mongo connection interrupted: ", err);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
