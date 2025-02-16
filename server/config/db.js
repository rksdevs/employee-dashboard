import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `DB connection succeful: ${conn.connection.host}`.blue.underline.bold
    );
  } catch (error) {
    console.log(`Error connecting to DB ${error}`);
    process.exit(1);
  }
};

export default connectToDb;
