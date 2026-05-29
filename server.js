require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Resend } = require('resend');
const Inquiry = require('./models/Inquiry');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── EMAIL (Resend — works over HTTPS, never blocked) ────────
const emailConfigured = !!process.env.RESEND_API_KEY;

if (!emailConfigured) {
  console.warn('⚠️  Email not configured — set RESEND_API_KEY in environment variables.');
} else {
  console.log('✓ Email configured via Resend');
}

const resend = emailConfigured ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendEnquiryEmail(inquiry) {
  const { name, email, phone, city, service, message } = inquiry;
  const firstName = name.split(' ')[0];

  await Promise.all([
    // Notification to owner
    resend.emails.send({
      from: 'Interior with Pratima <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO || 'pratikkudande1818@gmail.com'],
      subject: `New Enquiry from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f1014;color:#f5f5f7;padding:32px;border-radius:12px;">
          <h2 style="color:#e9b872;margin-top:0;">New Enquiry Received</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a3a7b5;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#a3a7b5;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#e9b872;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a3a7b5;">Phone</td><td style="padding:8px 0;"><a href="tel:${phone}" style="color:#e9b872;">${phone}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a3a7b5;">City</td><td style="padding:8px 0;">${city || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#a3a7b5;">Service</td><td style="padding:8px 0;">${service || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#a3a7b5;vertical-align:top;">Message</td><td style="padding:8px 0;">${message || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #262833;margin:24px 0;">
          <p style="color:#a3a7b5;font-size:12px;margin:0;">Sent from your website contact form</p>
        </div>
      `,
    }),

    // Confirmation to user
    resend.emails.send({
      from: 'Pratima Gaikwad – Interior Design <onboarding@resend.dev>',
      to: [email],
      subject: `We received your enquiry, ${firstName}!`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f1014;color:#f5f5f7;padding:32px;border-radius:12px;">
          <h2 style="color:#e9b872;margin-top:0;">Thank you for reaching out!</h2>
          <p style="color:#a3a7b5;line-height:1.7;">Hi ${firstName},</p>
          <p style="color:#a3a7b5;line-height:1.7;">
            We've received your enquiry about <strong style="color:#f5f5f7;">${service || 'our services'}</strong> and will get back to you within <strong style="color:#f5f5f7;">one working day</strong>.
          </p>
          <div style="background:#181a20;border-radius:8px;padding:20px;margin:24px 0;border-left:3px solid #e9b872;">
            <p style="margin:0 0 8px;color:#a3a7b5;font-size:13px;">YOUR ENQUIRY DETAILS</p>
            <p style="margin:4px 0;font-size:14px;"><span style="color:#a3a7b5;">Service:</span> ${service || '—'}</p>
            <p style="margin:4px 0;font-size:14px;"><span style="color:#a3a7b5;">Phone:</span> ${phone}</p>
            ${city ? `<p style="margin:4px 0;font-size:14px;"><span style="color:#a3a7b5;">City:</span> ${city}</p>` : ''}
          </div>
          <p style="color:#a3a7b5;line-height:1.7;">
            In the meantime, feel free to explore our work on
            <a href="https://www.instagram.com/interior_with_pratima_gaikwad" style="color:#e9b872;">Instagram</a>
            or WhatsApp us at
            <a href="https://wa.me/919552185151" style="color:#e9b872;">+91 95521 85151</a>.
          </p>
          <p style="color:#a3a7b5;margin-bottom:0;">Warm regards,<br><strong style="color:#f5f5f7;">Pratima Gaikwad</strong><br><span style="font-size:13px;">Interior with Pratima Gaikwad · Pune</span></p>
        </div>
      `,
    }),
  ]);
}

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

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'img', 'logo.png'));
});

// Basic locals
app.locals.siteTitle = 'Interior with Pratima Gaikwad';

// Routes
app.get('/', (req, res) => {
  res.render('pages/home', { page: 'home' });
});

app.get('/services', (req, res) => {
  res.render('pages/services', { page: 'services' });
});

app.get('/about', (req, res) => {
  res.render('pages/about', { page: 'about' });
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

    // Send email notification (non-blocking — don't fail the request if email fails)
    if (emailConfigured && resend) {
      sendEnquiryEmail({
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        city: inquiry.city,
        service: inquiry.service,
        message: inquiry.message,
      }).then(() => {
        console.log('✓ Enquiry emails sent');
      }).catch((emailErr) => {
        console.error('✗ Email send failed (inquiry still saved):', emailErr.message);
      });
    }

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


