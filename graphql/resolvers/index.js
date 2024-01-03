const Event = require("../../models/eventModel");
const User = require("../../models/userModel");
const Booking = require("../../models/bookingModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  events: async () => {
    try {
      const data = await Event.find().populate("creator");
      return data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },
  users: async () => {
    try {
      const users = await User.find().populate("events");

      return users;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },
  getUser: async (args) => {
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
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find().populate("event").populate("user");

      return bookings;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },
  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(),
        creator: "6593efaa5014d87bd3bc1b19",
      });

      const user = await User.findById("6593efaa5014d87bd3bc1b19");
      if (!user) {
        throw new Error("User not found!");
      }
      const savedEvent = await event.save();
      user.events.push(event);
      user.save();

      return {
        title: savedEvent.title,
        description: savedEvent.description,
        price: savedEvent.price,
        date: savedEvent.date.toISOString(),
        creator: savedEvent.creator,
      };
    } catch (error) {
      console.error(`Got error please check`, error);
      throw error;
    }
  },
  deleteEvent: async (args) => {
    try {
      const deletedEvent = await Event.findByIdAndDelete(args.id);

      if (!deletedEvent) {
        throw new Error("Event not found!");
      }

      const user = await User.findById(deletedEvent.creator);
      if (!user) {
        throw new Error("User not found!");
      }

      user.events = user.events.filter(
        (eventId) => eventId.toString() !== args.id
      );
      await user.save();

      return true;
    } catch (error) {
      console.error(`Got error please check`, error);
      throw error;
    }
  },
  createUser: async (args) => {
    const findUser = await User.findOne({ email: args.userInput.email });
    if (findUser) {
      throw new Error("User already exists!");
    }
    try {
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
  },
  bookEvent: async (args) => {
    try {
      const eventFound = await Event.findOne({ _id: args.id });
      if (!eventFound) {
        throw new Error("No event found, no booking available");
      }
      const booking = new Booking({
        user: "6593efaa5014d87bd3bc1b19",
        event: eventFound,
      });

      const bookingSaved = await booking.save();
      return bookingSaved;
    } catch (error) {
      console.error(`Got error please check`, error);
      throw error;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.id).populate("event");

      if (!booking) {
        throw new Error("Booking not found");
      }

      const event = await Event.findById(booking.event._id).populate("creator");

      // Delete the booking
      await Booking.deleteOne({ _id: args.id });

      // Return the event data
      return event;
    } catch (error) {
      console.error(`Got error please check`, error);
      throw error;
    }
  },
  login: async (args) => {
    try {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordvalid = await bcrypt.compare(
        args.password,
        user.password
      );

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
  },
};
