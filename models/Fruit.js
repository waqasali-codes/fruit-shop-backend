const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    stock: Number,
    unit: String,
    image: String,

    cloudinary_id: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Fruit",
  fruitSchema
);