const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  apartmentType: {
    type: String,
    required: true,
    trim: true,
    enum: [
      '1 Bedroom Apartment ($40 per night)',
      '2 Bedroom Apartment ($60 per night)',
      'Not sure yet'
    ]
  },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    validate: { validator: Number.isInteger, message: 'Guests must be a whole number.' }
  },
  message: { type: String, trim: true, default: '' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);