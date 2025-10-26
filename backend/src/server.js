const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { addSubscriber, getSubscriberCount, exportToCSV } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting - prevent spam
const subscribeLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, error: 'Too many subscription attempts, please try again later' }
});

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.key;
  const validKey = process.env.ADMIN_API_KEY;

  if (!validKey) {
    console.error('⚠️  ADMIN_API_KEY not set in environment!');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error'
    });
  }

  if (!apiKey || apiKey !== validKey) {
    console.warn(`🚨 Unauthorized admin access attempt from ${req.socket.remoteAddress}`);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid API key'
    });
  }

  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    subscriberCount: getSubscriberCount()
  });
});

// Subscribe endpoint
app.post('/api/subscribe', subscribeLimit, async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Valid email address required'
    });
  }

  // Basic email sanitization
  const sanitizedEmail = email.toLowerCase().trim();

  // Get client info for logging
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    const result = addSubscriber(sanitizedEmail, ipAddress, userAgent);

    if (result.success) {
      console.log(`✉️  New subscriber: ${sanitizedEmail}`);
      res.json({
        success: true,
        message: 'Successfully subscribed to updates!'
      });
    } else {
      res.status(409).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again later.'
    });
  }
});

// Admin endpoint to export subscribers (PROTECTED)
app.get('/api/admin/export', adminAuth, (req, res) => {
  console.log(`📊 Admin export requested from ${req.socket.remoteAddress}`);
  const csv = exportToCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Birdie Backend API running on port ${PORT}`);
  console.log(`📊 Total subscribers: ${getSubscriberCount()}`);
});

module.exports = app;
