require("dotenv/config");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const cardRoutes = require("./routes/cards");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors(corsOptions));
app.use("/auth", authRoutes);
app.use("/", cardRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yellowredcard.9adjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=YellowRedCard`
  )
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 8080;

mongoose.connection.once("open", () => {
  app.listen(port);
});
