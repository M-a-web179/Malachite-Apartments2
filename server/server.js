require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const Enquiry = require('./models/Enquiry');

const PORT = Number(process.env.PORT) || 3000;
const { MONGODB_URI, CLIENT_URL } = process.env;

if (!MONGODB_URI || !CLIENT_URL) {
  throw new Error('MONGODB_URI and CLIENT_URL must be set in the environment.');
}

const app = express();

app.use(cors({ origin: CLIENT_URL, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.post('/api/enquiries', async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const requiredFields = ['apartmentType', 'fullName', 'email', 'phone', 'checkIn', 'checkOut', 'guests'];
  const errors = {};

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      errors[field] = `${field} is required.`;
    }
  }

  const apartmentType = typeof body.apartmentType === 'string' ? body.apartmentType.trim() : '';
  const apartmentTypes = Enquiry.schema.path('apartmentType').enumValues;
  if (apartmentType && !apartmentTypes.includes(apartmentType)) {
    errors.apartmentType = 'Select a valid apartment type.';
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())) {
    errors.email = 'Enter a valid email address.';
  }

  const guests = Number(body.guests);
  if (body.guests !== undefined && (!Number.isInteger(guests) || guests < 1 || guests > 12)) {
    errors.guests = 'Guests must be a whole number between 1 and 12.';
  }

  function parseDate(value, field) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      errors[field] = `${field} must be a valid date in YYYY-MM-DD format.`;
      return null;
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
      errors[field] = `${field} must be a valid date.`;
      return null;
    }
    return date;
  }

  const checkIn = body.checkIn ? parseDate(body.checkIn, 'checkIn') : null;
  const checkOut = body.checkOut ? parseDate(body.checkOut, 'checkOut') : null;
  if (checkIn && checkOut && checkOut <= checkIn) {
    errors.checkOut = 'Check-out must be after check-in.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Please correct the enquiry details.', errors });
  }

  try {
    const enquiry = await Enquiry.create({
      apartmentType: String(body.apartmentType).trim(),
      fullName: String(body.fullName).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      checkIn,
      checkOut,
      guests,
      message: typeof body.message === 'string' ? body.message.trim() : ''
    });

    res.status(201).json({ success: true, message: 'Enquiry saved successfully.', enquiryId: enquiry.id });
  } catch (error) {
    console.error('Could not save enquiry:', error.message);
    res.status(500).json({ success: false, message: 'The enquiry could not be saved. Please try again.' });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ success: false, message: 'Request body must contain valid JSON.' });
  }
  console.error('API error:', error.message);
  res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
});

async function startServer() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => console.log(`Malachite enquiry API listening on port ${PORT}`));
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Could not connect to MongoDB:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;