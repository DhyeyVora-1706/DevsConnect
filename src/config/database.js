import mongoose from "mongoose";

export async function connectToDB() {
  try {
    const dbUrl = process.env.DB_URL;
    await mongoose.connect(dbUrl);
    console.log("DB Connected Successfully");
  } catch (err) {
    console.error("Error in DB connection");
    console.error(err);
  }
}
