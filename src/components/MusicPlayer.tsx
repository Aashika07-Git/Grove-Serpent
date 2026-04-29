import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Synthetic Awakening', artist: 'AI Core v1.2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Neon Pulse', artist: 'Algorithm Zero', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Cybernetic Flow', artist: 'Neural Network 7', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
         playPromise.catch(() => {
           // Auto-play was prevented by browser logic often until user interacts
           setIsPlaying(false);
         });
      }
    }
  }, [currentTrackIndex, isPlaying]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col md:flex-row items-center gap-4 bg-slate-900/50 backdrop-blur-md border border-cyan-500/50 p-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] text-cyan-50">
      
      <div className="flex bg-cyan-950/50 p-3 rounded-lg border border-cyan-500/30 items-center justify-center shrink-0 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]">
        <Music className={`w-8 h-8 text-cyan-400 ${isPlaying ? 'animate-pulse' : ''}`} />
      </div>

      <div className="flex-1 text-center md:text-left truncate w-full min-w-0">
        <h3 className="font-mono font-bold text-lg text-cyan-300 truncate [text-shadow:0_0_8px_rgba(103,232,249,0.5)]">{track.title}</h3>
        <p className="font-mono text-sm text-cyan-500 truncate">{track.artist}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button onClick={prevTrack} className="p-2 hover:bg-cyan-800/50 text-cyan-400 hover:text-cyan-200 rounded-full transition-colors">
          <SkipBack className="w-6 h-6 fill-current" />
        </button>
        <button onClick={togglePlay} className="p-3 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 hover:text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.4)] hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] rounded-full transition-all flex items-center justify-center">
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>
        <button onClick={nextTrack} className="p-2 hover:bg-cyan-800/50 text-cyan-400 hover:text-cyan-200 rounded-full transition-colors">
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>

      {/* Volume Control (Hidden on very small screens) */}
      <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-cyan-500/30 ml-2 shrink-0">
        <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-500 hover:text-cyan-300">
           {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
         <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 accent-cyan-400 cursor-pointer"
         />
      </div>

      <audio
        ref={audioRef}
        src={track.url}
        onEnded={nextTrack}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
}
