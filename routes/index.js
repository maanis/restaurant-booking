const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { login, logout, register } = require('../controllers/userAuth');
const booking = require('../models/booking');
const userModel = require('../models/userModel');

router.get('/', (req, res) => {
  res.render('dashboard'); 
});

router.get('/info', isLoggedIn,(req, res) => {
let user = req.user
  res.render('info', {user}); 
});

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

router.get('/register', (req, res) => {
  let error = req.flash('error')
  res.render('register', { error }); 
});

router.get('/booking', isLoggedIn,async (req, res) => {
  let user = await userModel.findOne({_id: req.user._id})
  console.log('user',user)
  res.render('bookingForm', { user }); 
});

router.post('/book', isLoggedIn, async (req, res) => {
  const { name, contact, date, timeFrom, timeTo, guests } = req.body;
  const existingBooking = await Booking.findOne({
    date,
    $or: [
      {
        $and: [
          { timeFrom: { $lt: timeTo } }, 
          { timeTo: { $gt: timeFrom } } 
        ]
      }
    ]
  });

  if (existingBooking) {
    return res.status(400).send('This time slot is already booked.');
  }

  const newBooking = new Booking({ name, contact, date, timeFrom, timeTo, guests });
  newBooking.bookedBy = req.user
  newBooking.userId = req.user._id
  await newBooking.save();

  let user = req.user
  user.bookings.push(newBooking)
  await user.save()

  
  res.redirect('my-booking')
});

router.get('/my-booking', isLoggedIn, async (req, res) => {

  let bookings = await booking.find({ userId: req.user._id })
  res.render('booking-summary', { bookings }); 
});


module.exports = router;
