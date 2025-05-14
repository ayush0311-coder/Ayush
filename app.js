const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Sample train data
const trains = [
  { id: 1, from: 'Delhi', to: 'Mumbai', time: '10:00 AM' },
  { id: 2, from: 'Delhi', to: 'Chennai', time: '2:00 PM' },
  { id: 3, from: 'Mumbai', to: 'Chennai', time: '5:00 PM' },
];

// In-memory bookings
const bookings = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home page (search form)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle train search
app.post('/search', (req, res) => {
  const { from, to, date } = req.body;
  const results = trains.filter(t => t.from === from && t.to === to);

  let html = '<h1>Available Trains</h1>';
  if (results.length === 0) {
    html += '<p>No trains found.</p>';
  } else {
    html += '<ul>';
    results.forEach(train => {
      html += `<li>Train ${train.id}: ${train.from} to ${train.to} at ${train.time}
        <form action="/book" method="post" style="margin-top:5px;">
          <input type="hidden" name="trainId" value="${train.id}">
          <input type="hidden" name="date" value="${date}">
          <label>Your Name: <input type="text" name="name" required></label>
          <input type="submit" value="Book">
        </form>
      </li>`;
    });
    html += '</ul>';
  }
  html += '<a href="/">Back</a>';
  res.send(html);
});

// Handle booking
app.post('/book', (req, res) => {
  const { trainId, name, date } = req.body;
  const train = trains.find(t => t.id == trainId);

  if (!train) {
    return res.send('<p>Train not found.</p><a href="/">Back</a>');
  }

  const booking = {
    id: bookings.length + 1,
    name,
    trainId: train.id,
    route: `${train.from} to ${train.to}`,
    time: train.time,
    date
  };

  bookings.push(booking);

  res.send(`
    <h1>Booking Confirmed</h1>
    <p>Thank you, ${name}.</p>
    <p>Train: ${train.from} to ${train.to} at ${train.time}</p>
    <p>Date: ${date}</p>
    <a href="/">Home</a> | <a href="/bookings">View All Bookings</a>
  `);
});

// Show all bookings
app.get('/bookings', (req, res) => {
  let html = '<h1>All Bookings</h1>';
  if (bookings.length === 0) {
    html += '<p>No bookings yet.</p>';
  } else {
    html += '<ul>';
    bookings.forEach(b => {
      html += `<li>${b.name} booked Train ${b.trainId} (${b.route}) at ${b.time} on ${b.date}</li>`;
    });
    html += '</ul>';
  }
  html += '<a href="/">Back</a>';
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`🚆 Railway Booking app running at http://localhost:${PORT}`);
});
