const Music = require('../models/Music');
const compressAudio = require('../utils/compressAudio');
const { bufferToBase64 } = require('../utils/base64Converter');

/**
 * @route   POST /api/music/upload
 * @desc    Upload, compress, and store a music track as Base64 in MongoDB
 * @access  Protected + Admin Only
 */
const uploadMusic = async (req, res) => {
  try {
    // Multer provides the file in req.file (memory storage)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an audio file',
      });
    }

    const { title, artist, genre } = req.body;

    // Validate required metadata
    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Please provide track title and artist name',
      });
    }

    const originalSize = req.file.size;

    // Step 1: Compress audio using FFmpeg (128kbps MP3)
    console.log(`🎵 Processing upload: "${title}" by ${artist}`);
    const { buffer: compressedBuffer, mimeType } = await compressAudio(
      req.file.buffer,
      req.file.originalname
    );

    // Step 2: Convert compressed buffer to Base64 data URI
    const audioBase64 = bufferToBase64(compressedBuffer, mimeType);

    // Step 3: Store in MongoDB
    const track = await Music.create({
      title,
      artist,
      genre: genre || 'Unknown',
      fileSize: originalSize,
      mimeType,
      audioBase64,
      createdBy: req.user._id,
    });

    console.log(
      `✅ Track saved: "${title}" (${(originalSize / 1024).toFixed(1)}KB → ${(compressedBuffer.length / 1024).toFixed(1)}KB compressed)`
    );

    // Respond with track metadata (exclude audioBase64 for efficiency)
    res.status(201).json({
      success: true,
      data: {
        _id: track._id,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        fileSize: track.fileSize,
        mimeType: track.mimeType,
        createdBy: track.createdBy,
        createdAt: track.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload track: ' + error.message,
    });
  }
};

/**
 * @route   GET /api/music
 * @desc    Get all music tracks (metadata only — no audioBase64 for performance)
 * @access  Protected (all authenticated users)
 */
const getAllMusic = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Exclude audioBase64 from list queries — it's fetched on-demand per track
    const tracks = await Music.find()
      .select('-audioBase64')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Music.countDocuments();

    res.json({
      success: true,
      data: tracks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/music/search?q=query
 * @desc    Search tracks by title, artist, or genre
 * @access  Protected (all authenticated users)
 */
const searchMusic = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
    }

    // Use MongoDB text search (indexes on title, artist, genre)
    // Fallback to regex if text search yields no results
    let tracks = await Music.find({ $text: { $search: q } })
      .select('-audioBase64')
      .populate('createdBy', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);

    // Regex fallback for partial matches
    if (tracks.length === 0) {
      const regex = new RegExp(q, 'i');
      tracks = await Music.find({
        $or: [{ title: regex }, { artist: regex }, { genre: regex }],
      })
        .select('-audioBase64')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(20);
    }

    res.json({
      success: true,
      data: tracks,
      query: q,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/music/:id
 * @desc    Get a single track WITH audioBase64 (for playback)
 * @access  Protected (all authenticated users)
 */
const getTrack = async (req, res) => {
  try {
    const track = await Music.findById(req.params.id).populate(
      'createdBy',
      'name'
    );

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found',
      });
    }

    res.json({
      success: true,
      data: track,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/music/:id
 * @desc    Delete a music track
 * @access  Protected + Admin Only
 */
const deleteTrack = async (req, res) => {
  try {
    const track = await Music.findById(req.params.id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found',
      });
    }

    await Music.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Track "${track.title}" deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadMusic,
  getAllMusic,
  searchMusic,
  getTrack,
  deleteTrack,
};
