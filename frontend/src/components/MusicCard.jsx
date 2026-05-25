import { useState, useRef, useEffect, useCallback } from 'react';
import { HiPlay, HiPause, HiTrash, HiMusicalNote, HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import musicService from '../services/musicService';
import toast from 'react-hot-toast';

// Client-side audio cache (Map of trackId → blobURL)
const audioCache = new Map();

const MusicCard = ({ track, onDelete }) => {
  const { isAdmin } = useAuth();
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [audioSrc, setAudioSrc] = useState(null);

  /**
   * Convert Base64 data URI to Blob URL.
   * This is MUCH faster for the browser than using data URIs directly.
   */
  const base64ToBlobUrl = useCallback((base64DataUri) => {
    const [header, data] = base64DataUri.split(',');
    const mimeMatch = header.match(/data:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'audio/mpeg';

    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mime });
    return URL.createObjectURL(blob);
  }, []);

  /**
   * Handle play/pause. Lazy-loads audio on first play.
   */
  const togglePlay = async () => {
    // First play: fetch the full track (with audioBase64)
    if (!audioSrc) {
      // Check cache first
      if (audioCache.has(track._id)) {
        setAudioSrc(audioCache.get(track._id));
        return; // useEffect will auto-play when audioSrc changes
      }

      setIsLoading(true);
      try {
        const res = await musicService.getTrack(track._id);
        const blobUrl = base64ToBlobUrl(res.data.audioBase64);
        audioCache.set(track._id, blobUrl); // Cache it
        setAudioSrc(blobUrl);
      } catch (error) {
        toast.error('Failed to load track');
        setIsLoading(false);
      }
      return;
    }

    // Toggle play/pause
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // Auto-play when audioSrc is first set
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  }, [audioSrc]);

  // Audio event handlers
  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Seek
  const handleSeek = (e) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  // Volume
  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  // Format time helper
  const formatTime = (sec) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Delete handler
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${track.title}"? This cannot be undone.`)) return;
    try {
      await musicService.deleteTrack(track._id);
      // Revoke cached Blob URL
      if (audioCache.has(track._id)) {
        URL.revokeObjectURL(audioCache.get(track._id));
        audioCache.delete(track._id);
      }
      toast.success(`"${track.title}" deleted`);
      if (onDelete) onDelete(track._id);
    } catch (error) {
      toast.error('Failed to delete track');
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Clean aesthetic gradients (Emerald/Cyan)
  const gradients = [
    'from-accent-primary/80 to-accent-hover/80',
    'from-accent-cyan/80 to-accent-primary/80',
    'from-emerald-600/80 to-emerald-400/80',
    'from-teal-600/80 to-teal-400/80',
  ];
  const gradientIndex = (track.title?.charCodeAt(0) || 0) % gradients.length;

  return (
    <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-1 relative">
      {/* Admin Delete Button */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30 flex items-center justify-center text-red-400 text-sm opacity-0 group-hover:opacity-100 hover:bg-red-500/40 hover:scale-110 transition-all duration-200"
          title="Delete track"
        >
          <HiTrash />
        </button>
      )}

      {/* Album Art Placeholder */}
      <div className={`w-full aspect-square bg-gradient-to-br ${gradients[gradientIndex]} relative flex items-center justify-center overflow-hidden`}>
        <HiMusicalNote className="text-5xl text-black/30 z-10" />

        {/* Animated bars */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[3px] items-end h-7">
          {[12, 20, 8, 24, 16].map((h, i) => (
            <span
              key={i}
              className={`w-1 bg-white/70 rounded-sm bar-animate ${!isPlaying ? 'paused' : ''}`}
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Track Info */}
      <div className="p-4">
        <h3 className="text-[0.95rem] font-semibold text-txt-primary truncate">{track.title}</h3>
        <p className="text-sm text-txt-secondary truncate mb-2">{track.artist}</p>
        <span className="inline-block text-[0.65rem] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary border border-accent-primary/20">
          {track.genre || 'Unknown'}
        </span>
      </div>

      {/* Audio Player */}
      <div className="px-4 pb-4 pt-2 border-t border-white/[0.05]">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-11 h-11 rounded-full bg-accent-primary flex items-center justify-center text-black text-lg flex-shrink-0 shadow-lg shadow-accent-primary/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-accent-primary/30 ${isLoading ? 'animate-pulse' : ''}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : isPlaying ? (
              <HiPause />
            ) : (
              <HiPlay className="ml-0.5" />
            )}
          </button>

          {/* Progress */}
          <div className="flex-1 flex flex-col gap-1">
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="w-full h-1 bg-white/[0.08] rounded-full cursor-pointer group/progress hover:h-1.5 transition-all"
            >
              <div
                className="player-progress-fill h-full bg-accent-primary/50 rounded-full relative transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[0.65rem] text-txt-muted tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-1.5 text-txt-secondary">
            {volume === 0 ? (
              <HiSpeakerXMark className="text-sm" />
            ) : (
              <HiSpeakerWave className="text-sm" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="volume-slider w-16"
            />
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default MusicCard;
