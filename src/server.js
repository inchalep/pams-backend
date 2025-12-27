const express = require("express");
const cors = require("cors");
require("dotenv").config();
const router = require("./routers");
const connectDb = require("./db");
const errorLogger = require("./middleware/errorLogger");
const errorHandler = require("./middleware/errorHandlerMiddlewar");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
connectDb()
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((e) => {
    console.log("Unable to connect:", e);
    process.exit(1);
  });

app.use("/api", router);

app.use("/health", (req, res) => {
  return res.status(200).json({
    message: "ok",
  });
});

app.use(errorLogger);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log("Server runnig on port:", PORT);
});
