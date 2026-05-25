import api from './api';

const musicService = {
  /**
   * Upload a new track (Admin only)
   * @param {FormData} formData - Contains audio file, title, artist, genre
   * @param {Function} onUploadProgress - Callback for Axios progress event
   */
  uploadTrack: async (formData, onUploadProgress) => {
    const res = await api.post('/music/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return res.data;
  },

  /**
   * Get all tracks (Metadata only, audioBase64 excluded)
   */
  getAllTracks: async () => {
    const res = await api.get('/music');
    return res.data;
  },

  /**
   * Get a single track including its full audioBase64 string for playback
   * @param {string} id - Track ID
   */
  getTrack: async (id) => {
    const res = await api.get(`/music/${id}`);
    return res.data;
  },

  /**
   * Search tracks by query string (searches title, artist, genre)
   * @param {string} query - Search term
   */
  searchTracks: async (query) => {
    const res = await api.get(`/music/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },

  /**
   * Delete a track by ID (Admin only)
   * @param {string} id - Track ID
   */
  deleteTrack: async (id) => {
    const res = await api.delete(`/music/${id}`);
    return res.data;
  },
};

export default musicService;
