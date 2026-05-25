import { useState, useRef } from 'react';
import { HiCloudArrowUp, HiMusicalNote, HiXMark } from 'react-icons/hi2';
import musicService from '../services/musicService';
import toast from 'react-hot-toast';

const UploadForm = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB limit to fit safely in MongoDB

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('audio/')) {
      toast.error('Please select a valid audio file');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 6MB limit');
      return;
    }

    setFile(selectedFile);
    // Auto-fill title if empty
    if (!title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
      setTitle(nameWithoutExt);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleClearFile = (e) => {
    e.preventDefault();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title.trim() || !artist.trim() || !genre) {
      toast.error('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('title', title.trim());
    formData.append('artist', artist.trim());
    formData.append('genre', genre);

    try {
      setUploading(true);
      setProgress(0);

      await musicService.uploadTrack(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });

      toast.success('Track uploaded successfully!');
      
      // Reset form
      setFile(null);
      setTitle('');
      setArtist('');
      setGenre('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Drag & Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            dragOver
              ? 'border-accent-primary bg-accent-primary/5'
              : 'border-white/[0.08] hover:border-accent-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files[0])}
            accept="audio/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            disabled={uploading}
          />

          {!file ? (
            <div className="pointer-events-none">
              <HiCloudArrowUp className={`text-5xl mx-auto mb-4 transition-all duration-300 ${dragOver ? 'text-accent-primary -translate-y-1' : 'text-txt-muted'}`} />
              <h3 className="text-lg font-semibold text-txt-primary mb-1">
                Drag & drop your audio file here, or <span className="text-accent-primary">browse</span>
              </h3>
              <p className="text-sm text-txt-secondary">
                Max file size: 6MB (Files will be compressed to 128kbps)
              </p>
            </div>
          ) : (
            <div className="relative z-10 flex items-center justify-between bg-bg-secondary border border-white/[0.08] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                  <HiMusicalNote className="text-accent-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-txt-primary truncate max-w-[200px] md:max-w-[300px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-txt-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearFile}
                disabled={uploading}
                className="p-2 text-txt-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">Track Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight City"
              disabled={uploading}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-txt-primary text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] transition-all disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">Artist</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. M83"
              disabled={uploading}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-txt-primary text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-2">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            disabled={uploading}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-txt-primary text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="" disabled>Select a genre</option>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Hip Hop">Hip Hop</option>
            <option value="Electronic">Electronic</option>
            <option value="Jazz">Jazz</option>
            <option value="Classical">Classical</option>
            <option value="R&B">R&B</option>
            <option value="Indie">Indie</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Upload Button & Progress */}
        <div className="pt-2">
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-txt-secondary mb-2">
                <span>Uploading & Compressing...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-primary rounded-full relative progress-shimmer transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-4 rounded-xl bg-accent-primary text-black font-semibold text-sm shadow-lg shadow-accent-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-primary/30 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden btn-shimmer"
          >
            {uploading ? 'Processing...' : 'Upload Track'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
