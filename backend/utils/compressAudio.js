const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

/**
 * Compress Audio Utility
 * Uses FFmpeg to compress audio files to 128kbps MP3.
 * Falls back to passthrough if FFmpeg is not installed.
 *
 * Flow: Buffer → temp file → FFmpeg compress → compressed buffer → cleanup
 */

/**
 * Compress an audio buffer to 128kbps MP3 using FFmpeg.
 * @param {Buffer} inputBuffer - Raw audio file buffer from Multer
 * @param {string} originalName - Original filename (for extension detection)
 * @returns {Promise<{buffer: Buffer, mimeType: string}>} Compressed audio buffer and MIME type
 */
const compressAudio = async (inputBuffer, originalName = 'audio.mp3') => {
  // Generate unique temp filenames to avoid collisions
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `input_${uniqueId}_${originalName}`);
  const outputPath = path.join(tempDir, `output_${uniqueId}.mp3`);

  try {
    // Write input buffer to temp file (FFmpeg needs file paths)
    fs.writeFileSync(inputPath, inputBuffer);

    // Compress using FFmpeg: convert to 128kbps MP3, single channel for smaller size
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .audioChannels(2)
        .audioFrequency(44100)
        .format('mp3')
        .on('end', resolve)
        .on('error', (err) => {
          console.warn(`⚠️ FFmpeg compression error: ${err.message}`);
          reject(err);
        })
        .save(outputPath);
    });

    // Read the compressed file back into a buffer
    const compressedBuffer = fs.readFileSync(outputPath);

    console.log(
      `🎵 Audio compressed: ${(inputBuffer.length / 1024).toFixed(1)}KB → ${(compressedBuffer.length / 1024).toFixed(1)}KB`
    );

    return {
      buffer: compressedBuffer,
      mimeType: 'audio/mpeg',
    };
  } catch (error) {
    // Fallback: If FFmpeg fails or is not installed, pass through the original buffer
    console.warn(
      '⚠️ FFmpeg not available or compression failed. Using original audio buffer.'
    );
    console.warn(
      '   Install FFmpeg for audio compression: https://ffmpeg.org/download.html'
    );

    // Determine MIME type from extension
    const ext = path.extname(originalName).toLowerCase();
    const mimeMap = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.flac': 'audio/flac',
      '.aac': 'audio/aac',
    };

    return {
      buffer: inputBuffer,
      mimeType: mimeMap[ext] || 'audio/mpeg',
    };
  } finally {
    // Cleanup: Remove temp files (fire-and-forget)
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch {}
    try {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch {}
  }
};

module.exports = compressAudio;
