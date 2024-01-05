const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginUser = async (args) => {
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

    return { userId: user._id, token: token, tokenExpiration: 7 };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

module.exports = { loginUser };
