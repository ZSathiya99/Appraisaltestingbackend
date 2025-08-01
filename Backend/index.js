const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/User");
const loginRoutes = require("./route/loginRoute");
const uploadRoute = require("./route/uploadRoute");
const path = require("path");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");

  // Start server only after DB connected
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});
app.use("/", loginRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // to access uploaded files
app.use("/api", uploadRoute);

