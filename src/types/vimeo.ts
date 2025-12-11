/**
 * TypeScript definitions for Vimeo Player API
 * Reference: https://github.com/vimeo/player.js
 */

export interface VimeoPlayerOptions {
  id?: number;
  url?: string;
  autopause?: boolean;
  autoplay?: boolean;
  background?: boolean;
  byline?: boolean;
  color?: string;
  controls?: boolean;
  dnt?: boolean;
  height?: number;
  interactive_params?: string;
  keyboard?: boolean;
  loop?: boolean;
  maxheight?: number;
  maxwidth?: number;
  muted?: boolean;
  pip?: boolean;
  playsinline?: boolean;
  portrait?: boolean;
  quality?: 'auto' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';
  responsive?: boolean;
  speed?: boolean;
  texttrack?: string;
  title?: boolean;
  transparent?: boolean;
  width?: number;
}

export interface VimeoTimeEvent {
  duration: number;
  percent: number;
  seconds: number;
}

export interface VimeoTextTrack {
  label: string;
  language: string;
  kind: string;
  mode?: 'disabled' | 'showing';
}

export interface VimeoQuality {
  label: string;
  id: string;
  active: boolean;
}

export interface VimeoPlaybackRate {
  rate: number;
}

export interface VimeoError {
  name: string;
  message: string;
  method: string;
}

export class VimeoPlayer {
  constructor(element: HTMLElement | string, options?: VimeoPlayerOptions);

  // Playback controls
  play(): Promise<void>;
  pause(): Promise<void>;
  getPaused(): Promise<boolean>;
  setCurrentTime(seconds: number): Promise<number>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  setPlaybackRate(playbackRate: number): Promise<number>;
  getPlaybackRate(): Promise<number>;
  seekTo(seconds: number): Promise<number>;

  // Volume controls
  setVolume(volume: number): Promise<number>;
  getVolume(): Promise<number>;
  setMuted(muted: boolean): Promise<boolean>;
  getMuted(): Promise<boolean>;

  // Quality
  getQualities(): Promise<VimeoQuality[]>;
  getQuality(): Promise<string>;
  setQuality(quality: string): Promise<string>;

  // Text tracks (subtitles/captions)
  enableTextTrack(language: string, kind?: string): Promise<VimeoTextTrack>;
  disableTextTrack(): Promise<void>;
  getTextTracks(): Promise<VimeoTextTrack[]>;

  // Video information
  getVideoUrl(): Promise<string>;
  getVideoId(): Promise<number>;
  getVideoTitle(): Promise<string>;

  // Event listeners
  on(event: string, callback: Function): void;
  off(event: string, callback?: Function): void;
  ready(): Promise<void>;

  // DOM
  destroy(): Promise<void>;
  getElement(): HTMLElement;
}

// Event types
export type VimeoEventName =
  | 'play'
  | 'playing'
  | 'pause'
  | 'ended'
  | 'timeupdate'
  | 'progress'
  | 'seeking'
  | 'seeked'
  | 'texttrackchange'
  | 'chapterchange'
  | 'cuechange'
  | 'cuepoint'
  | 'volumechange'
  | 'playbackratechange'
  | 'bufferstart'
  | 'bufferend'
  | 'error'
  | 'loaded'
  | 'durationchange'
  | 'fullscreenchange'
  | 'qualitychange'
  | 'camerachange'
  | 'resize'
  | 'enterpictureinpicture'
  | 'leavepictureinpicture';

declare global {
  interface Window {
    Vimeo?: {
      Player: typeof VimeoPlayer;
    };
  }
}
