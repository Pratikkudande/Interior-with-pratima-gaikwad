require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Inquiry = require('./models/Inquiry');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interior_with_pratima';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic locals
app.locals.siteTitle = 'Interior with Pratima Gaikwad';

// Routes
app.get('/', (req, res) => {
  res.render('pages/home', { page: 'home' });
});

app.get('/services', (req, res) => {
  res.render('pages/services', { page: 'services' });
});

app.get('/contact', (req, res) => {
  const selectedService = req.query.service || '';
  res.render('pages/contact', { page: 'contact', success: null, error: null, selectedService });
});

app.post('/contact', async (req, res) => {
  const { name, email, phone, city, service, serviceSelect, message } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.render('pages/contact', {
        page: 'contact',
        success: null,
        error: 'Please fill in name, email and phone.',
        selectedService: serviceSelect || service || '',
      });
    }

    const finalService = service || serviceSelect || 'Not specified';

    await Inquiry.create({
      name,
      email,
      phone,
      city,
      service: finalService,
      message,
    });

    res.render('pages/contact', {
      page: 'contact',
      success: 'Thank you! Your enquiry has been received.',
      error: null,
      selectedService: '',
    });
  } catch (err) {
    console.error('Error saving inquiry:', err.message);
    res.render('pages/contact', {
      page: 'contact',
      success: null,
      error: 'Something went wrong. Please try again.',
      selectedService: serviceSelect || service || '',
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', { page: '404' });
});

app.listen(PORT, () => {
  console.log(`Interior with Pratima Gaikwad site running on http://localhost:${PORT}`);
});


