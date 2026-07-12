const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  shipper: {
    type: String,
    required: true,
  },
  consignee: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Customs Clearance', 'Arrived', 'Delivered'],
    default: 'Pending',
  },
  timeline: [
    {
      description: {
        type: String,
        required: true,
      },
      location: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Shipment', shipmentSchema);
