const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
})

module.exports = mongoose.model('user', userModel);