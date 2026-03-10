let iframeApiPromise: Promise<void> | null = null;

export interface YouTubePlayer {
  destroy: () => void;
  cueVideoById: (videoId: string) => void;
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  isMuted: () => boolean;
  mute: () => void;
  unMute: () => void;
  setPlaybackRate: (rate: number) => void;
}

export interface YouTubePlayerReadyEvent {
  target: YouTubePlayer;
}

export interface YouTubePlayerStateChangeEvent {
  data: number;
  target: YouTubePlayer;
}

export interface YouTubePlayerOptions {
  videoId: string;
  playerVars?: Record<string, unknown>;
  events?: {
    onReady?: (event: YouTubePlayerReadyEvent) => void;
    onStateChange?: (event: YouTubePlayerStateChangeEvent) => void;
  };
}

export interface YouTubeNamespace {
  Player?: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.YT?.Player) return Promise.resolve();
  if (iframeApiPromise) return iframeApiPromise;

  iframeApiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (window.YT?.Player) resolve();
      else reject(new Error('Timed out loading YouTube IFrame API'));
    }, 15000);

    const safeResolve = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };

    const safeReject = (error: unknown) => {
      window.clearTimeout(timeoutId);
      reject(error);
    };

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      try {
        previousReady?.();
      } finally {
        safeResolve();
      }
    };

    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => safeReject(new Error('Failed to load YouTube IFrame API'));
      document.head.appendChild(script);
    }
  });

  return iframeApiPromise;
}
