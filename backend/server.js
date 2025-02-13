require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const hallsRoutes = require('./routes/hallreq');
const reservedSeatsRoutes = require('./routes/seatreserve');
const ReservedSeat = require('./models/reservedseat'); 
const schedule = require('node-schedule');
const getSeats = require('./routes/getSeats')
const userBookings = require('./routes/userBookings')

const app = express();
const PORT = process.env.PORT || 6969;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(bodyParser.json()); 

// Routes
app.use( authRoutes);
app.use( hallsRoutes);
app.use( reservedSeatsRoutes);
app.use( getSeats )
app.use( userBookings)

// Clearing reservations at midnight


schedule.scheduleJob('0 0 * * *', async () => {
  try {
    console.log('Running midnight cleanup');

    // Get the current date
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Delete only reservations for today
    const result = await ReservedSeat.deleteMany({
      date: formattedToday,
    });

    console.log(
      `${result.deletedCount} reservations cleared for date: ${formattedToday}`
    );
  } catch (error) {
    console.error('Error clearing reservations:', error.message);
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
