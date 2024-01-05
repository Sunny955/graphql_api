const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (args, { res }) => {
  try {
    const user = await User.findOne({ email: args.email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordvalid = await bcrypt.compare(args.password, user.password);

    if (!isPasswordvalid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    // Set an HTTP-only cookie with the token
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { userId: user._id, token: token, tokenExpiration: 7 };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

const logout = async (args, { res }) => {
  res.clearCookie("authToken");
  return { message: "Logout successful" };
};

module.exports = { login, logout };
