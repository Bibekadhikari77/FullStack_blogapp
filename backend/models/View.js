const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  // Store IP address or user ID for tracking unique views
  identifier: {
    type: String,
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to ensure one view per identifier per post
viewSchema.index({ post: 1, identifier: 1 }, { unique: true });

module.exports = mongoose.model('View', viewSchema);
