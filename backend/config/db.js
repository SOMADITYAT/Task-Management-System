import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Connected to MongoDB: ${mongoose.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.error(`Error: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

export default connectDB;
