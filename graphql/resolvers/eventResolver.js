const Event = require("../../models/eventModel");
const User = require("../../models/userModel");

const createEvent = async (args, req) => {
  try {
    if (!req.isAuth) {
      throw new Error("Not authenticated please login");
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(),
      creator: req.userId,
    });

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not found!");
    }
    const savedEvent = await event.save();
    user.events.push(event);
    user.save();

    return {
      _id: savedEvent._id,
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
};

const events = async () => {
  try {
    const data = await Event.find().populate("creator");
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const deleteEvent = async (args) => {
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
};

module.exports = { createEvent, deleteEvent, events };
