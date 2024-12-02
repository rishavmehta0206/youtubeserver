import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).send({
      message: "missing required fields",
    });
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    let newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(200).json({status:200,message:"User created sucessfully."});
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000,
    //   })
    //   .status(200)
    //   .json({
    //     message: "Login successful",
    //     user: userWithoutPassword,
    //   });
    res.status(200).json({ ...userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};
