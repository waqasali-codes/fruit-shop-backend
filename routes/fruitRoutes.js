const express = require("express");
const router = express.Router();
const Fruit = require("../models/Fruit");
const upload = require("../middleware/upload");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const mongoose = require("mongoose");
const protect = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

router.get("/", async (req, res) => {
  try {
    const fruits = await Fruit.find();
    res.json(fruits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    // upload to cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    const fruit = await Fruit.create({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      unit: req.body.unit,
      image: result.secure_url,
      cloudinary_id: result.public_id,
    });

    res.status(201).json({
      message: "Fruit created",
      fruit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {

    const fruit = await Fruit.findById(req.params.id);

    if (!fruit) {
      return res.status(404).json({
        message: "Fruit not found",
      });
    }

    // delete image from cloudinary
    await cloudinary.uploader.destroy(
      fruit.cloudinary_id
    );

    // delete fruit from mongodb
    await Fruit.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Fruit and image deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

module.exports = router;