const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const uploadRoute = require("./route/uploadfileRoute");
const loginRoute = require("./route/loginRoute");
const combinedRoute = require("./route/combinedRoute");
const uploadEmployeesRoute = require("./route/uploadEmployees");


dotenv.config();
const app = express();
app.use(express.json());

app.use("/api", uploadRoute);
app.use("/api", loginRoute);
app.use("/api", combinedRoute);
app.use("/api", uploadEmployeesRoute);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
})
.catch(err => console.error("DB error", err));
