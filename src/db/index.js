const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
  const connection = await mongoose.connect(MONGO_URI);
  return connection;
};

module.exports = connectDb;
