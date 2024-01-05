const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

const createUser = async (args) => {
  try {
    const findUser = await User.findOne({ email: args.userInput.email });

    if (findUser) {
      throw new Error("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    const user = new User({
      email: args.userInput.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    return { _id: savedUser._id, email: savedUser.email, password: null };
  } catch (error) {
    console.error(`Got error please check`, error);
    throw error;
  }
};

const getUser = async (args) => {
  try {
    const user = await User.findById(args.id).populate("events");

    if (!user) {
      throw new Error(`No user found with the given id!`);
    }

    return user;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const users = async () => {
  try {
    const users = await User.find().populate("events");

    return users;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const userEvents = async (args, req) => {
  try {
    if (!req.isAuth) {
      throw new Error("Not authenticated please login");
    }

    const userId = req.userId;

    // Fetch events for the authenticated user
    const user = await User.findById(userId).populate("events");

    if (!user) {
      throw new Error("User not found");
    }

    return user.events;
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
};

module.exports = { userEvents, createUser, getUser, users };
