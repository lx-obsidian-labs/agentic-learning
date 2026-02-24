'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Settings, SkipBack, SkipForward, RotateCcw, ListVideo, FileText } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  timestamps?: { time: string; label: string }[];
  videoQuality?: 'must-watch' | 'supplementary';
  playbackSpeed?: number;
  autoplay?: boolean;
}

export default function VideoPlayer({ 
  videoId, 
  title, 
  timestamps = [], 
  videoQuality = 'must-watch',
  playbackSpeed: initialSpeed = 1,
  autoplay = false
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(initialSpeed);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [volume, setVolume] = useState(80);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  
  const getYouTubeEmbedUrl = useCallback((startAt = 0) => {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = [
      `modestbranding=1`,
      `rel=0`,
      `showinfo=0`,
      `controls=1`,
      `enablejsapi=1`,
      `origin=${typeof window !== 'undefined' ? window.location.origin : ''}`,
      `start=${Math.floor(startAt)}`,
      `playbackrate=${playbackSpeed}`
    ].join('&');
    return `${baseUrl}?${params}`;
  }, [videoId, playbackSpeed]);

  const handleTimestampClick = (timestamp: { time: string; label: string }) => {
    const [mins, secs] = timestamp.time.split(':').map(Number);
    const seconds = mins * 60 + secs;
    
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
      iframeRef.current.src = getYouTubeEmbedUrl(seconds);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (iframeRef.current) {
      const command = !isPlaying ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [newTime, true] }),
        '*'
      );
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [newVolume] }),
        '*'
      );
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [speed] }),
        '*'
      );
    }
    setShowSpeedMenu(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: isMuted ? 'unMute' : 'mute', args: [] }),
        '*'
      );
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.info) {
          if (data.info.currentTime !== undefined) {
            setCurrentTime(data.info.currentTime);
          }
          if (data.info.duration !== undefined) {
            setDuration(data.info.duration);
          }
          if (data.info.playerState === 1) {
            setIsPlaying(true);
          } else if (data.info.playerState === 2) {
            setIsPlaying(false);
          }
        }
      } catch (e) {}
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-black rounded-2xl overflow-hidden shadow-2xl"
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          if (isPlaying) setShowControls(false);
        }, 3000);
      }}
    >
      <div className="relative aspect-video bg-gray-900">
        <iframe
          ref={iframeRef}
          key={videoId}
          className="absolute inset-0 w-full h-full"
          src={getYouTubeEmbedUrl()}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={handlePlayPause}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm shadow-lg ${
            videoQuality === 'must-watch' 
              ? 'bg-green-600/90 text-white' 
              : 'bg-yellow-600/90 text-white'
          }`}>
            {videoQuality === 'must-watch' ? '⭐ ESSENTIAL' : '📚 SUPPLEMENTARY'}
          </span>
        </div>
        
        <div className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => setShowTimestamps(!showTimestamps)}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
            title="Show timestamps"
          >
            <ListVideo className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {playbackSpeed}x
            </button>
            
            {showSpeedMenu && (
              <div className="absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl z-20">
                {speeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                      playbackSpeed === speed ? 'text-blue-400 bg-gray-800' : 'text-white'
                    }`}
                  >
                    {speed}x {speed === 1 && '(Normal)'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={toggleFullscreen}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-20 pb-4 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between text-white mb-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleSkip(-10)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => handleSkip(10)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Forward 10s"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
              
              <span className="text-sm font-mono ml-4">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
          
          <div className="h-1 bg-white/20 rounded-full cursor-pointer group">
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
                <span className="text-blue-400 mr-1">{ts.time}</span>
                {ts.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
