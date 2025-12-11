import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { Source } from '../../types';
import { extractVimeoId } from '../../utils/embed-utils';
import { VimeoPlayer as VimeoPlayerClass } from '../../types/vimeo';
import loadScript from '../../utils/load-script';
import styles from './VimeoPlayer.module.css';

const VIMEO_API_URL = 'https://player.vimeo.com/api/player.js';
const VIMEO_VARIABLE_NAME = 'Vimeo';

export interface VimeoPlayerProps {
  source: Source;
  autoPlay?: boolean;
  muted?: boolean;
  onReady?: () => void;
}

export const VimeoPlayer = React.forwardRef<HTMLDivElement, VimeoPlayerProps>(
  ({ source, autoPlay = false, muted = false, onReady }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const playerRef = React.useRef<VimeoPlayerClass | null>(null);
    const { setVideoState } = useVideo();
    const [isReady, setIsReady] = React.useState(false);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const videoId = React.useMemo(() => {
      return extractVimeoId(source.file);
    }, [source.file]);

    // Load Vimeo API and initialize player
    React.useEffect(() => {
      if (!videoId) return;

      let isMounted = true;

      const initPlayer = async () => {
        // Prevent multiple initializations
        if (playerRef.current) return;
        if (!containerRef.current) return;

        try {
          // Load Vimeo Player API
          const Vimeo = await loadScript<{ Player: typeof VimeoPlayerClass }>(
            VIMEO_API_URL,
            VIMEO_VARIABLE_NAME
          );

          if (!isMounted || !containerRef.current) return;

          // Check again after async operations
          if (playerRef.current) return;

          // Create player
          const player = new Vimeo.Player(containerRef.current, {
            id: parseInt(videoId),
            width: undefined, // Let CSS handle sizing
            height: undefined,
            autoplay: autoPlay,
            muted: muted,
            controls: false, // Hide Vimeo controls, use custom controls
            playsinline: true,
            byline: false,
            portrait: false,
            title: false,
            transparent: false,
          });

          playerRef.current = player;

          // Wait for player to be ready
          await player.ready();

          if (!isMounted) return;

          setIsReady(true);

          // Initialize video props
          const [duration, volume, paused] = await Promise.all([
            player.getDuration(),
            player.getVolume(),
            player.getPaused(),
          ]);

          setVideoState({
            duration,
            volume,
            paused,
          });

          // Set up event listeners
          player.on('play', () => {
            setVideoState({ paused: false });
          });

          player.on('pause', () => {
            setVideoState({ paused: true });
          });

          player.on('ended', () => {
            setVideoState({ ended: true, paused: true });
          });

          player.on('timeupdate', (data: any) => {
            setVideoState({
              currentTime: data.seconds,
              duration: data.duration,
            });
          });

          player.on('volumechange', (data: any) => {
            setVideoState({
              volume: data.volume,
            });
          });

          player.on('bufferstart', () => {
            setVideoState({ buffering: true });
          });

          player.on('bufferend', () => {
            setVideoState({ buffering: false });
          });

          player.on('seeking', () => {
            setVideoState({ seeking: true });
          });

          player.on('seeked', () => {
            setVideoState({ seeking: false });
          });

          player.on('error', (error: any) => {
            console.error('Vimeo player error:', error);
            setVideoState({
              error: error.message || 'Vimeo player error',
            });
          });

          onReady?.();
        } catch (error) {
          console.error('Failed to load Vimeo player:', error);
          if (isMounted) {
            setVideoState({
              error: 'Failed to load Vimeo player',
            });
          }
        }
      };

      initPlayer();

      return () => {
        isMounted = false;
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
            playerRef.current = null;
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    // Expose player methods to VideoContext
    React.useEffect(() => {
      if (!isReady || !playerRef.current) return;

      const player = playerRef.current;

      // Track current state
      let currentDuration = 0;
      let currentPaused = true;
      let currentTimeValue = 0;
      let currentVolume = 1;
      let currentPlaybackRate = 1;

      // Update cached values
      player.getDuration().then(d => currentDuration = d);
      player.getPaused().then(p => currentPaused = p);
      player.getCurrentTime().then(t => currentTimeValue = t);
      player.getVolume().then(v => currentVolume = v);
      player.getPlaybackRate().then(r => currentPlaybackRate = r);

      player.on('durationchange', (data: any) => {
        currentDuration = data.duration;
      });

      player.on('play', () => {
        currentPaused = false;
      });

      player.on('pause', () => {
        currentPaused = true;
      });

      player.on('timeupdate', (data: any) => {
        currentTimeValue = data.seconds;
      });

      player.on('volumechange', (data: any) => {
        currentVolume = data.volume;
      });

      player.on('playbackratechange', (data: any) => {
        currentPlaybackRate = data.playbackRate;
      });

      // Create a pseudo video element interface
      const videoInterface = {
        play: async () => {
          try {
            await player.play();
          } catch (e) {
            console.error('Play failed:', e);
          }
        },
        pause: async () => {
          try {
            await player.pause();
          } catch (e) {
            console.error('Pause failed:', e);
          }
        },
        setCurrentTime: async (time: number) => {
          try {
            await player.setCurrentTime(time);
          } catch (e) {
            console.error('Seek failed:', e);
          }
        },
        get duration() {
          return currentDuration;
        },
        get paused() {
          return currentPaused;
        },
        get currentTime() {
          return currentTimeValue;
        },
        get volume() {
          return currentVolume;
        },
        set volume(vol: number) {
          player.setVolume(vol);
          currentVolume = vol;
        },
        get playbackRate() {
          return currentPlaybackRate;
        },
        set playbackRate(rate: number) {
          player.setPlaybackRate(rate);
          currentPlaybackRate = rate;
        },
      };

      // Store reference for controls to use
      (window as any).__vimeoPlayer = videoInterface;

      return () => {
        delete (window as any).__vimeoPlayer;
      };
    }, [isReady]);

    if (!videoId) {
      return (
        <div className={styles.error}>
          <p>Invalid Vimeo video ID</p>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div ref={containerRef} className={styles.player} />
      </div>
    );
  }
);

VimeoPlayer.displayName = 'VimeoPlayer';
