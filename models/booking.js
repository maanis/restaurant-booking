const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeFrom: {
    type: String,
    required: true,
  },
  timeTo: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  },
  userId: String
});

module.exports = mongoose.model('Booking', bookingSchema);
