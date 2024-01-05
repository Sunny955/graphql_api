const bookEvent = async (args, req) => {
  if (!req.isAuth) {
    throw new Error(`Not authenticated please login`);
  }
  try {
    const eventFound = await Event.findOne({ _id: args.id });
    if (!eventFound) {
      throw new Error("No event found, no booking available");
    }
    const booking = new Booking({
      user: req.userId,
      event: eventFound,
    });

    const bookingSaved = await booking.save();
    return bookingSaved;
  } catch (error) {
    console.error(`Got error please check`, error);
    throw error;
  }
};

const cancelBooking = async (args, req) => {
  try {
    if (!req.isAuth) {
      throw new Error("No authenticated please login!");
    }
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
};

const bookings = async () => {
  try {
    if (!req.isAuth) {
      throw new Error("No authenticated please login!");
    }

    const bookings = await Booking.find().populate("event").populate("user");

    return bookings;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

module.exports = { bookEvent, cancelBooking, bookings };
