const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  uploadMusic,
  getAllMusic,
  searchMusic,
  getTrack,
  deleteTrack,
} = require('../controllers/musicController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * Multer configuration: Memory storage (no disk writes)
 * Files are held in buffer for processing → Base64 conversion
 * Limit: 6MB (from MAX_FILE_SIZE env var)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 6 * 1024 * 1024, // 6MB default
  },
  fileFilter: (req, file, cb) => {
    // Accept only audio files
    const allowedMimes = [
      'audio/mpeg',       // .mp3
      'audio/wav',        // .wav
      'audio/wave',       // .wav (alternative)
      'audio/x-wav',      // .wav (alternative)
      'audio/ogg',        // .ogg
      'audio/mp4',        // .m4a
      'audio/aac',        // .aac
      'audio/flac',       // .flac
      'audio/x-flac',     // .flac (alternative)
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only audio files (MP3, WAV, OGG, M4A, AAC, FLAC) are allowed.`
        ),
        false
      );
    }
  },
});

// ============================================
// Routes — order matters for param matching
// ============================================

// Search must come before /:id to avoid "search" being parsed as an ID
router.get('/search', protect, searchMusic);

// All music (metadata only) — all authenticated users
router.get('/', protect, getAllMusic);

// Upload — admin only
router.post('/upload', protect, adminOnly, upload.single('audio'), uploadMusic);

// Single track with audio data (for playback) — all authenticated users
router.get('/:id', protect, getTrack);

// Delete — admin only
router.delete('/:id', protect, adminOnly, deleteTrack);

module.exports = router;
