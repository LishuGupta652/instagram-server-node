require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Connection to mongoDB
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

// Middleware
app.use(express.json());

// Models
require("./models/user");
require("./models/post");

// Router Middleware
app.use(require("./routes/auth"));
app.use(require("./routes/post"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
