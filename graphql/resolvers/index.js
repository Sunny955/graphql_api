const { userEvents, createUser, getUser, users } = require("./userResolver");
const { login, logout } = require("./authResolver");
const { bookEvent, cancelBooking, bookings } = require("./bookingResolver");
const { createEvent, deleteEvent, events } = require("./eventResolver");

module.exports = {
  events,
  users,
  getUser,
  bookings,
  createEvent,
  deleteEvent,
  createUser,
  bookEvent,
  cancelBooking,
  login,
  logout,
  userEvents,
};
