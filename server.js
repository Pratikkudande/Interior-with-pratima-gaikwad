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
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    
    // Provide helpful guidance for common issues
    if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.error('\n⚠️  IP Whitelisting Issue Detected!');
      console.error('To fix this:');
      console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
      console.error('2. Navigate to: Network Access → Add IP Address');
      console.error('3. Click "Add Current IP Address" or add 0.0.0.0/0 (allows all IPs - less secure)');
      console.error('4. Wait 1-2 minutes for changes to propagate');
      console.error('5. Restart your application\n');
    }
    
    console.error('Full error:', err);
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
  console.log('POST /contact received');
  console.log('Request body:', req.body);
  
  const { name, email, phone, city, service, serviceSelect, message } = req.body;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. State:', mongoose.connection.readyState);
      return res.render('pages/contact', {
        page: 'contact',
        success: null,
        error: 'Database connection issue. Please try again in a moment.',
        selectedService: serviceSelect || service || '',
      });
    }

    if (!name || !email || !phone) {
      return res.render('pages/contact', {
        page: 'contact',
        success: null,
        error: 'Please fill in name, email and phone.',
        selectedService: serviceSelect || service || '',
      });
    }

    const finalService = service || serviceSelect || 'Not specified';

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city ? city.trim() : '',
      service: finalService,
      message: message ? message.trim() : '',
    });

    console.log('✓ Inquiry saved successfully:', inquiry._id);
    res.render('pages/contact', {
      page: 'contact',
      success: 'Thank you! Your enquiry has been received. We will get back to you soon.',
      error: null,
      selectedService: '',
    });
  } catch (err) {
    console.error('✗ Error saving inquiry:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Full error:', err);
    
    // More specific error messages
    let errorMsg = 'Something went wrong. Please try again.';
    if (err.name === 'ValidationError') {
      errorMsg = 'Please check your form fields and try again.';
    } else if (err.name === 'MongoServerError') {
      errorMsg = 'Database error. Please try again in a moment.';
    }
    
    res.render('pages/contact', {
      page: 'contact',
      success: null,
      error: errorMsg,
      selectedService: serviceSelect || service || '',
    });
  }
});

// 404 handler (must be last)
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).render('pages/404', { page: '404' });
});

app.listen(PORT, () => {
  console.log(`Interior with Pratima Gaikwad site running on http://localhost:${PORT}`);
});


