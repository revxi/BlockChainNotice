const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  noticeId: {
    type: Number,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
