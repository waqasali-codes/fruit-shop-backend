require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db"); 

const fruitRoutes = require("./routes/fruitRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

// connect DB ONCE
connectDB();

// Routes
app.use("/api/fruits", fruitRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});