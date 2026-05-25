/**
 * Base64 Converter Utility
 * Handles conversion between Buffers and Base64 strings
 * for audio storage in MongoDB.
 */

/**
 * Convert a file buffer to a Base64-encoded data URI string.
 * @param {Buffer} buffer - The file buffer to convert
 * @param {string} mimeType - MIME type (e.g., 'audio/mpeg')
 * @returns {string} Base64 data URI string ready for storage
 */
const bufferToBase64 = (buffer, mimeType = 'audio/mpeg') => {
  const base64String = buffer.toString('base64');
  return `data:${mimeType};base64,${base64String}`;
};

/**
 * Convert a Base64 data URI string back to a Buffer.
 * Strips the data URI prefix before decoding.
 * @param {string} base64String - The Base64 data URI string
 * @returns {Buffer} Decoded binary buffer
 */
const base64ToBuffer = (base64String) => {
  // Remove data URI prefix if present (e.g., "data:audio/mpeg;base64,")
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String;

  return Buffer.from(base64Data, 'base64');
};

module.exports = { bufferToBase64, base64ToBuffer };
