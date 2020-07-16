require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Middleware
app.use(express.json());

// Models
require("./models/user");

// Router Middleware
app.use(require("./routes/auth"));

mongoose.connect(
  "mongodb+srv://lishugupta652:lishugupta652@instagram-cluster.xcxnv.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
