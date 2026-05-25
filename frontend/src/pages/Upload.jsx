import { useState, useEffect } from 'react';
import { HiMusicalNote, HiTrash } from 'react-icons/hi2';
import UploadForm from '../components/UploadForm';
import musicService from '../services/musicService';
import toast from 'react-hot-toast';

const Upload = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTracks = async () => {
    try {
      const res = await musicService.getAllTracks();
      // Sort newest first
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTracks(sorted);
    } catch (error) {
      toast.error('Failed to fetch track list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleDelete = async (trackId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await musicService.deleteTrack(trackId);
      setTracks((prev) => prev.filter((t) => t._id !== trackId));
      toast.success(`Deleted "${title}"`);
    } catch (error) {
      toast.error('Failed to delete track');
    }
  };

  return (
    <div className="flex-1 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Admin <span className="text-accent-primary">Dashboard</span>
          </h1>
          <p className="text-txt-secondary text-sm">
            Upload and manage the RaisaVerse music library
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Upload Form Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <h2 className="text-xl font-semibold text-txt-primary mb-6">Upload New Track</h2>
            <UploadForm onUploadSuccess={fetchTracks} />
          </div>

          {/* Track List Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="text-xl font-semibold text-txt-primary mb-6">
              Library Management <span className="text-txt-muted text-sm font-normal ml-2">({tracks.length} tracks)</span>
            </h2>

            <div className="glass rounded-3xl overflow-hidden border border-white/[0.05]">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
                </div>
              ) : tracks.length === 0 ? (
                <div className="p-12 text-center text-txt-muted">
                  No tracks uploaded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.05] bg-bg-secondary/50">
                        <th className="px-6 py-4 text-xs font-semibold text-txt-secondary uppercase tracking-wider">Track</th>
                        <th className="px-6 py-4 text-xs font-semibold text-txt-secondary uppercase tracking-wider hidden sm:table-cell">Genre</th>
                        <th className="px-6 py-4 text-xs font-semibold text-txt-secondary uppercase tracking-wider hidden md:table-cell">Date</th>
                        <th className="px-6 py-4 text-xs font-semibold text-txt-secondary uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {tracks.map((track) => (
                        <tr key={track._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center flex-shrink-0">
                                <HiMusicalNote className="text-txt-muted" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-txt-primary truncate">{track.title}</p>
                                <p className="text-xs text-txt-secondary truncate">{track.artist}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-medium bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                              {track.genre || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell text-xs text-txt-muted">
                            {new Date(track.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(track._id, track.title)}
                              className="p-2 text-txt-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Delete Track"
                            >
                              <HiTrash className="text-lg" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Upload;
