const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmailNotification = (subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'saharshkhalokar14@gmail.com',
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error sending email:', error.message);
    } else {
      console.log('✅ Email sent successfully:', info.response);
    }
  });
};

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kimaya-sorry';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Visit Schema
const visitSchema = new mongoose.Schema({
  visitorIP: { type: String, default: 'unknown' },
  userAgent: { type: String, default: '' },
  referrer: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  sections: {
    hero: { type: Boolean, default: true },
    photoWall: { type: Boolean, default: false },
    letter: { type: Boolean, default: false },
    reasons: { type: Boolean, default: false },
    hugButton: { type: Boolean, default: false },
    promiseJar: { type: Boolean, default: false },
  },
  hugClicked: { type: Boolean, default: false },
  timeSpentSeconds: { type: Number, default: 0 },
  deviceType: { type: String, default: '' },
});

const Visit = mongoose.model('Visit', visitSchema);

// Notification Schema - to track if you've been notified
const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  visitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit' },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);

// ============ API ROUTES ============

// Track a new visit (called when she opens the website)
app.post('/api/visit', async (req, res) => {
  try {
    const { userAgent, referrer, deviceType } = req.body;
    const visitorIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    const visit = new Visit({
      visitorIP,
      userAgent,
      referrer,
      deviceType,
    });

    await visit.save();

    // Create a notification
    const notification = new Notification({
      type: 'visit',
      message: `💕 She opened the website! (${new Date().toLocaleString()})`,
      visitId: visit._id,
    });
    await notification.save();

    console.log(`\n🌸 ═══════════════════════════════════════`);
    console.log(`💕 SHE OPENED THE WEBSITE!`);
    console.log(`📱 Device: ${deviceType || 'Unknown'}`);
    console.log(`🕐 Time: ${new Date().toLocaleString()}`);
    console.log(`🌸 ═══════════════════════════════════════\n`);

    res.json({ success: true, visitId: visit._id });
  } catch (err) {
    console.error('Error tracking visit:', err);
    res.json({ success: false });
  }
});

// Update visit with section views and interactions
app.patch('/api/visit/:id', async (req, res) => {
  try {
    const { sections, hugClicked, timeSpentSeconds } = req.body;
    const update = {};

    if (sections) update.sections = sections;
    if (hugClicked !== undefined) update.hugClicked = hugClicked;
    if (timeSpentSeconds !== undefined) update.timeSpentSeconds = timeSpentSeconds;

    await Visit.findByIdAndUpdate(req.params.id, update);

    if (hugClicked) {
      const notification = new Notification({
        type: 'hug',
        message: `🤗 She clicked the HUG button! 💕 (${new Date().toLocaleString()})`,
        visitId: req.params.id,
      });
      await notification.save();

      console.log(`\n💝 ═══════════════════════════════════════`);
      console.log(`🤗 SHE CLICKED THE HUG BUTTON! 💕`);
      console.log(`🕐 Time: ${new Date().toLocaleString()}`);
      console.log(`💝 ═══════════════════════════════════════\n`);

      // Send email notification for the hug
      sendEmailNotification(
        '🤗 SHE CLICKED THE HUG BUTTON! 💕', 
        `She just clicked the Virtual Hug button!\n\nTime: ${new Date().toLocaleString()}`
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating visit:', err);
    res.json({ success: false });
  }
});

// Get all visits (for you to check)
app.get('/api/visits', async (req, res) => {
  try {
    const visits = await Visit.find().sort({ timestamp: -1 });
    const totalVisits = visits.length;
    const hugCount = visits.filter(v => v.hugClicked).length;

    res.json({
      success: true,
      totalVisits,
      hugCount,
      visits,
    });
  } catch (err) {
    console.error('Error fetching visits:', err);
    res.json({ success: false });
  }
});

// Get all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.json({ success: false });
  }
});

// Dashboard route - simple HTML page to check visits
app.get('/dashboard', async (req, res) => {
  try {
    const visits = await Visit.find().sort({ timestamp: -1 });
    const notifications = await Notification.find().sort({ timestamp: -1 }).limit(20);

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>💌 Sorry Website - Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Poppins', sans-serif; 
          background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
          color: #fff;
          min-height: 100vh;
          padding: 2rem;
        }
        h1 { text-align: center; margin-bottom: 2rem; font-size: 2rem; }
        .stats { 
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          margin-bottom: 2rem; 
        }
        .stat-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem 2rem;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.15);
          min-width: 200px;
        }
        .stat-card h2 { font-size: 2.5rem; color: #ff6b9d; }
        .stat-card p { opacity: 0.7; font-size: 0.9rem; }
        .notifications {
          max-width: 700px;
          margin: 0 auto 2rem;
        }
        .notif {
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 0.5rem;
          border-left: 3px solid #ff6b9d;
          font-size: 0.95rem;
        }
        .notif .time { opacity: 0.5; font-size: 0.8rem; }
        .visit-table {
          width: 100%; max-width: 900px; margin: 0 auto;
          border-collapse: collapse;
        }
        .visit-table th, .visit-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 0.85rem;
        }
        .visit-table th { color: #ff6b9d; }
        .badge { 
          background: #ff6b9d; color: #fff; 
          padding: 2px 8px; border-radius: 20px; font-size: 0.75rem;
        }
        .badge.no { background: rgba(255,255,255,0.2); }
        @media (max-width: 600px) {
          body { padding: 1rem; }
          .stat-card { min-width: 140px; padding: 1rem; }
        }
      </style>
      <meta http-equiv="refresh" content="10">
    </head>
    <body>
      <h1>💌 Sorry Website Dashboard</h1>
      <div class="stats">
        <div class="stat-card">
          <h2>${visits.length}</h2>
          <p>Total Visits</p>
        </div>
        <div class="stat-card">
          <h2>${visits.filter(v => v.hugClicked).length}</h2>
          <p>Hugs Received 🤗</p>
        </div>
        <div class="stat-card">
          <h2>${visits.length > 0 ? Math.round(visits.reduce((a, v) => a + v.timeSpentSeconds, 0) / visits.length) : 0}s</h2>
          <p>Avg Time Spent</p>
        </div>
      </div>

      <div class="notifications">
        <h3 style="margin-bottom:1rem;">📢 Recent Activity</h3>
        ${notifications.map(n => `
          <div class="notif">
            ${n.message}
          </div>
        `).join('')}
        ${notifications.length === 0 ? '<div class="notif">No activity yet... Share the link! 💕</div>' : ''}
      </div>

      <table class="visit-table">
        <thead>
          <tr><th>Time</th><th>Device</th><th>Hug?</th><th>Time Spent</th></tr>
        </thead>
        <tbody>
          ${visits.map(v => `
            <tr>
              <td>${new Date(v.timestamp).toLocaleString()}</td>
              <td>${v.deviceType || 'Unknown'}</td>
              <td><span class="badge ${v.hugClicked ? '' : 'no'}">${v.hugClicked ? '💕 Yes' : 'Not yet'}</span></td>
              <td>${v.timeSpentSeconds}s</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>`;

    res.send(html);
  } catch (err) {
    res.send('Error loading dashboard');
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '💕 Server is running!' });
});

app.listen(PORT, () => {
  console.log(`\n🌸 ═══════════════════════════════════════`);
  console.log(`💌 Sorry Website Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🌸 ═══════════════════════════════════════\n`);
});
