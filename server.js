const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const loginRoute = require("./routes/loginRoute");
const uploadEmployeesRoute = require("./routes/uploadEmployees");
const teachingRoutes = require("./routes/teachingRoutes");


dotenv.config();
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use("/api", loginRoute);
app.use("/api", uploadEmployeesRoute);
app.use('/api', teachingRoutes);

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
