/**
 * TypeScript definitions for YouTube IFrame Player API
 * Reference: https://developers.google.com/youtube/iframe_api_reference
 */

export interface YouTubePlayerOptions {
  height?: string | number;
  width?: string | number;
  videoId?: string;
  playerVars?: YouTubePlayerVars;
  events?: YouTubePlayerEvents;
}

export interface YouTubePlayerVars {
  autoplay?: 0 | 1;
  cc_lang_pref?: string;
  cc_load_policy?: 1;
  color?: 'red' | 'white';
  controls?: 0 | 1 | 2;
  disablekb?: 0 | 1;
  enablejsapi?: 0 | 1;
  end?: number;
  fs?: 0 | 1;
  hl?: string;
  iv_load_policy?: 1 | 3;
  list?: string;
  listType?: 'playlist' | 'search' | 'user_uploads';
  loop?: 0 | 1;
  modestbranding?: 1;
  mute?: 0 | 1;
  origin?: string;
  playlist?: string;
  playsinline?: 0 | 1;
  rel?: 0 | 1;
  showinfo?: 0 | 1;
  start?: number;
  widget_referrer?: string;
}

export interface YouTubePlayerEvents {
  onReady?: (event: YouTubePlayerEvent) => void;
  onStateChange?: (event: YouTubePlayerEvent) => void;
  onPlaybackQualityChange?: (event: YouTubePlayerEvent) => void;
  onPlaybackRateChange?: (event: YouTubePlayerEvent) => void;
  onError?: (event: YouTubePlayerEvent) => void;
  onApiChange?: (event: YouTubePlayerEvent) => void;
}

export interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: any;
}

export enum YouTubePlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export interface YouTubePlayer {
  // Playback controls
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;

  // Volume controls
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;

  // Playback status
  getPlayerState(): YouTubePlayerState;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;

  // Playback rate
  setPlaybackRate(suggestedRate: number): void;
  getPlaybackRate(): number;
  getAvailablePlaybackRates(): number[];

  // Quality
  getAvailableQualityLevels(): string[];

  // DOM
  getIframe(): HTMLIFrameElement;

  // Utility
  destroy(): void;
}

export interface YouTubeIframeAPI {
  Player: {
    new (elementId: string | HTMLElement, options: YouTubePlayerOptions): YouTubePlayer;
  };
  PlayerState: typeof YouTubePlayerState;
}

declare global {
  interface Window {
    YT?: YouTubeIframeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}
