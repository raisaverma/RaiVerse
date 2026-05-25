import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiMusicalNote, HiArrowUpTray } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import musicService from '../services/musicService';
import MusicCard from '../components/MusicCard';
import toast from 'react-hot-toast';

const Home = () => {
  const { isAdmin } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const res = await musicService.getAllTracks();
      setTracks(res.data);
    } catch (error) {
      toast.error('Failed to load music library');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    (() => {
      let timeout;
      return (query) => {
        setSearchQuery(query);
        clearTimeout(timeout);

        if (!query.trim()) {
          fetchTracks();
          return;
        }

        timeout = setTimeout(async () => {
          setSearching(true);
          try {
            const res = await musicService.searchTracks(query);
            setTracks(res.data);
          } catch (error) {
            toast.error('Search failed');
          } finally {
            setSearching(false);
          }
        }, 400);
      };
    })(),
    []
  );

  const handleDelete = (trackId) => {
    setTracks((prev) => prev.filter((t) => t._id !== trackId));
  };

  const SkeletonCard = () => (
    <div className="glass rounded-2xl overflow-hidden border border-white/[0.05]">
      <div className="w-full aspect-square skeleton rounded-none" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-5 w-16 skeleton rounded-full" />
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-white/[0.02]">
        <div className="h-10 skeleton rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="flex-1 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Music <span className="text-accent-primary">Library</span>
            </h1>
            <p className="text-txt-secondary text-sm">
              {!loading && `${tracks.length} track${tracks.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Bar */}
            <div className="relative min-w-[280px]">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search tracks, artists, genres..."
                className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-txt-primary text-[0.95rem] focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] transition-all duration-200 placeholder:text-txt-muted"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Admin Upload Button */}
            {isAdmin && (
              <Link
                to="/upload"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-black font-semibold text-sm hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent-primary/20 transition-all duration-300 relative overflow-hidden btn-shimmer"
              >
                <HiArrowUpTray className="text-lg" />
                Upload
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : tracks.length > 0 ? (
          /* Music Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tracks.map((track) => (
              <MusicCard key={track._id} track={track} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
              <HiMusicalNote className="text-4xl text-txt-muted" />
            </div>
            <h3 className="text-xl font-semibold text-txt-secondary mb-2">
              {searchQuery ? 'No tracks found' : 'No music yet'}
            </h3>
            <p className="text-txt-muted text-sm max-w-md mx-auto mb-6">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : 'The library is empty. Waiting for the admin to upload some tracks!'}
            </p>
            {isAdmin && !searchQuery && (
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-black font-semibold text-sm hover:-translate-y-0.5 hover:bg-accent-hover transition-all duration-300 shadow-lg shadow-accent-primary/20"
              >
                <HiArrowUpTray />
                Upload First Track
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
