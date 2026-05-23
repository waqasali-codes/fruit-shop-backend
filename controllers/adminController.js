const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER ADMIN
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check existing admin
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN ADMIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // generate jwt
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Success",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};