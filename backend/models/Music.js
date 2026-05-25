const mongoose = require('mongoose');

/**
 * Music Schema
 * Stores track metadata and the compressed Base64-encoded audio.
 * The audioBase64 field holds the full audio as a Base64 string.
 * createdBy references the User (admin) who uploaded the track.
 */
const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Track title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    artist: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
      maxlength: [100, 'Artist name cannot exceed 100 characters'],
    },
    genre: {
      type: String,
      trim: true,
      default: 'Unknown',
      maxlength: [50, 'Genre cannot exceed 50 characters'],
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0,
    },
    fileSize: {
      type: Number, // Original file size in bytes
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'audio/mpeg',
    },
    audioBase64: {
      type: String,
      required: [true, 'Audio data is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and user-specific queries
musicSchema.index({ title: 'text', artist: 'text', genre: 'text' });
musicSchema.index({ createdBy: 1 });
musicSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Music', musicSchema);
