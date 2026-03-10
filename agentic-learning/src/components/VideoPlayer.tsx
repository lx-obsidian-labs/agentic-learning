'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  FileText,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  loadYouTubeIframeAPI,
  type YouTubePlayer,
  type YouTubePlayerReadyEvent,
  type YouTubePlayerStateChangeEvent,
} from '@/lib/youtube';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  timestamps?: { time: string; label: string }[];
  videoQuality?: 'must-watch' | 'supplementary';
  playbackSpeed?: number;
  autoplay?: boolean;
  onProgress?: (secondsWatched: number) => void;
}

function parseTimestampToSeconds(value: string) {
  const parts = value.split(':').map(Number);
  if (parts.some(n => Number.isNaN(n))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({
  videoId,
  title,
  timestamps = [],
  videoQuality = 'must-watch',
  playbackSpeed: initialSpeed = 1,
  autoplay = false,
  onProgress,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(initialSpeed);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [videoNotFound, setVideoNotFound] = useState(false);

  const isValidVideoId = useMemo(() => {
    const pattern = /^[a-zA-Z0-9_-]{11}$/;
    return pattern.test(videoId);
  }, [videoId]);

  useEffect(() => {
    setVideoNotFound(!isValidVideoId);
  }, [isValidVideoId]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerMountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const lastReportedTimeRef = useRef(0);
  const accumulatedWatchRef = useRef(0);

  const speeds = useMemo(() => [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], []);

  useEffect(() => {
    setPlaybackSpeed(initialSpeed);
  }, [initialSpeed]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        await loadYouTubeIframeAPI();
        if (cancelled) return;

        const YT = window.YT;
        if (!YT || !YT.Player) throw new Error('YouTube API not available');
        if (!playerMountRef.current) return;

        playerRef.current = new YT.Player(playerMountRef.current, {
          videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            fs: 0,
          },
          events: {
            onReady: (event: YouTubePlayerReadyEvent) => {
              try {
                event.target.setVolume(volume);
                event.target.setPlaybackRate(playbackSpeed);
                setDuration(event.target.getDuration?.() ?? 0);
                setIsMuted(Boolean(event.target.isMuted?.()));
                setIsReady(true);
              } catch {
                setIsReady(true);
              }
            },
            onStateChange: (event: YouTubePlayerStateChangeEvent) => {
              const state = event.data;
              // https://developers.google.com/youtube/iframe_api_reference#onStateChange
              if (state === 1) setIsPlaying(true);
              else if (state === 2 || state === 0) setIsPlaying(false);
            },
          },
        });
      } catch (err) {
        if (cancelled) return;
        setApiError(err instanceof Error ? err.message : 'Failed to load player');
      }
    };

    init();

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const player = playerRef.current;
    if (!player?.cueVideoById) return;

    lastReportedTimeRef.current = 0;
    accumulatedWatchRef.current = 0;

    try {
      if (autoplay) player.loadVideoById(videoId);
      else player.cueVideoById(videoId);
      setCurrentTime(0);
    } catch {}
  }, [videoId, autoplay, isReady]);

  useEffect(() => {
    if (!isReady) return;
    const player = playerRef.current;
    if (!player?.setPlaybackRate) return;
    try {
      player.setPlaybackRate(playbackSpeed);
    } catch {}
  }, [playbackSpeed, isReady]);

  useEffect(() => {
    if (!isReady) return;
    const player = playerRef.current;
    if (!player?.setVolume) return;
    try {
      player.setVolume(volume);
    } catch {}
  }, [volume, isReady]);

  useEffect(() => {
    if (!isReady) return;
    const intervalId = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      try {
        const t = player.getCurrentTime?.();
        const d = player.getDuration?.();
        if (Number.isFinite(t)) setCurrentTime(t);
        if (Number.isFinite(d) && d > 0) setDuration(d);
        setIsMuted(Boolean(player.isMuted?.()));

        if (onProgress && isPlaying && Number.isFinite(t)) {
          const delta = t - lastReportedTimeRef.current;
          if (delta > 0 && delta < 10) {
            accumulatedWatchRef.current += delta;
            if (accumulatedWatchRef.current >= 30) {
              onProgress(accumulatedWatchRef.current);
              accumulatedWatchRef.current = 0;
            }
          }
          lastReportedTimeRef.current = t;
        }
      } catch {}
    }, 500);
    return () => window.clearInterval(intervalId);
  }, [isReady, isPlaying, onProgress]);

  const handlePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (isPlaying) player.pauseVideo();
      else player.playVideo();
    } catch {}
  };

  const handleSkip = (seconds: number) => {
    const player = playerRef.current;
    if (!player?.seekTo) return;
    const next = Math.max(0, Math.min(duration || 0, currentTime + seconds));
    try {
      player.seekTo(next, true);
      setCurrentTime(next);
    } catch {}
  };

  const handleSeek = (clientX: number, rect: DOMRect) => {
    const player = playerRef.current;
    if (!player?.seekTo || !duration) return;
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const next = pct * duration;
    try {
      player.seekTo(next, true);
      setCurrentTime(next);
    } catch {}
  };

  const handleVolumeChange = (nextVolume: number) => {
    const player = playerRef.current;
    setVolume(nextVolume);
    if (!player) return;
    try {
      if (nextVolume <= 0) {
        player.mute?.();
        setIsMuted(true);
      } else {
        player.unMute?.();
        setIsMuted(false);
      }
      player.setVolume?.(nextVolume);
    } catch {}
  };

  const handleMuteToggle = () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (isMuted) {
        player.unMute?.();
        setIsMuted(false);
      } else {
        player.mute?.();
        setIsMuted(true);
      }
    } catch {}
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const handleTimestampClick = (timestamp: { time: string; label: string }) => {
    const seconds = parseTimestampToSeconds(timestamp.time);
    const player = playerRef.current;
    if (!player?.seekTo) return;
    try {
      player.seekTo(seconds, true);
      player.playVideo?.();
      setIsPlaying(true);
      setCurrentTime(seconds);
    } catch {}
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const player = playerRef.current;
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        if (!player) return;
        try {
          if (isPlaying) player.pauseVideo();
          else player.playVideo();
        } catch {}
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (!player?.seekTo) return;
        try {
          const next = Math.max(0, Math.min(duration || 0, currentTime - 10));
          player.seekTo(next, true);
          setCurrentTime(next);
        } catch {}
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (!player?.seekTo) return;
        try {
          const next = Math.max(0, Math.min(duration || 0, currentTime + 10));
          player.seekTo(next, true);
          setCurrentTime(next);
        } catch {}
        break;
      case 'ArrowUp':
        e.preventDefault();
        {
          const newVol = Math.min(100, volume + 10);
          setVolume(newVol);
          if (player) {
            try {
              if (newVol <= 0) { player.mute?.(); setIsMuted(true); }
              else { player.unMute?.(); setIsMuted(false); }
              player.setVolume?.(newVol);
            } catch {}
          }
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        {
          const newVol = Math.max(0, volume - 10);
          setVolume(newVol);
          if (player) {
            try {
              if (newVol <= 0) { player.mute?.(); setIsMuted(true); }
              else { player.unMute?.(); setIsMuted(false); }
              player.setVolume?.(newVol);
            } catch {}
          }
        }
        break;
      case 'm':
        e.preventDefault();
        if (!player) return;
        try {
          if (isMuted) { player.unMute?.(); setIsMuted(false); }
          else { player.mute?.(); setIsMuted(true); }
        } catch {}
        break;
      case 'f':
        e.preventDefault();
        if (!document.fullscreenElement) {
          wrapperRef.current?.requestFullscreen();
          setIsFullscreen(true);
        } else {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
        break;
    }
  }, [isPlaying, volume, isMuted, duration, currentTime]);

  const fallbackEmbedUrl = useMemo(() => {
    const params = new URLSearchParams({
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId]);

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
      <div ref={wrapperRef} className="relative aspect-video bg-black" tabIndex={0} onKeyDown={handleKeyDown} role="application" aria-label="Video player">
        {videoNotFound ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">!</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Not Available</h3>
            <p className="text-gray-400 text-center max-w-md mb-4">
              The video &quot;{title}&quot; is currently unavailable. Please try searching for alternative videos.
            </p>
            <a 
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' ' + 'tutorial')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Search YouTube
            </a>
          </div>
        ) : apiError ? (
          <iframe
            title={title}
            src={fallbackEmbedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <div ref={playerMountRef} className="absolute inset-0 w-full h-full" />
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              videoQuality === 'must-watch' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-100'
            }`}
          >
            {videoQuality === 'must-watch' ? 'Must‑Watch' : 'Supplementary'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            {title}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(s => !s)}
              className="bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2"
              title="Playback speed"
            >
              <Settings className="w-4 h-4" />
              {playbackSpeed}x
            </button>

            {showSpeedMenu && (
              <div className="absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl z-20">
                {speeds.map(speed => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                      playbackSpeed === speed ? 'text-blue-300 bg-gray-800' : 'text-white'
                    }`}
                  >
                    {speed}x {speed === 1 && '(Normal)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowTimestamps(s => !s)}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
            title={showTimestamps ? 'Hide topics' : 'Show topics'}
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-16 pb-4 px-4">
          <div className="flex items-center justify-between text-white mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSkip(-10)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Rewind 10s"
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                aria-pressed={isPlaying}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={() => handleSkip(10)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Forward 10s"
                aria-label="Forward 10 seconds"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 ml-3">
                <button 
                  onClick={handleMuteToggle} 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  aria-label="Volume"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={isMuted ? 0 : volume}
                  aria-valuetext={`${isMuted ? 0 : volume}%`}
                  onChange={e => handleVolumeChange(Number(e.target.value))}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>

              <span className="text-sm font-mono ml-4">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          <div
            className="h-1 bg-white/20 rounded-full cursor-pointer group"
            onClick={e => handleSeek(e.clientX, e.currentTarget.getBoundingClientRect())}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>

      {showTimestamps && timestamps.length > 0 && (
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Topics in this video
          </h4>
          <div className="flex flex-wrap gap-2">
            {timestamps.map((ts, idx) => (
              <button
                key={idx}
                onClick={() => handleTimestampClick(ts)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white"
              >
                <span className="text-blue-300 mr-1">{ts.time}</span>
                {ts.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
