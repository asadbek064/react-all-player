import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { Source } from '../../types';
import { extractYouTubeId } from '../../utils/embed-utils';
import {
  YouTubePlayer as YTPlayer,
  YouTubePlayerState,
  YouTubeIframeAPI,
} from '../../types/youtube';
import loadScript from '../../utils/load-script';
import styles from './YouTubePlayer.module.css';

const YOUTUBE_API_URL = 'https://www.youtube.com/iframe_api';
const YOUTUBE_VARIABLE_NAME = 'YT';

export interface YouTubePlayerProps {
  source: Source;
  autoPlay?: boolean;
  muted?: boolean;
  onReady?: () => void;
}

export const YouTubePlayer = React.forwardRef<
  HTMLDivElement,
  YouTubePlayerProps
>(({ source, autoPlay = false, muted = false, onReady }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<YTPlayer | null>(null);
  const { setVideoState } = useVideo();
  const [isReady, setIsReady] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const playerIdRef = React.useRef(`youtube-player-${Math.random().toString(36).substr(2, 9)}`);

  React.useImperativeHandle(ref, () => containerRef.current!);

  const videoId = React.useMemo(() => {
    return extractYouTubeId(source.file);
  }, [source.file]);

  // Load YouTube API and initialize player
  React.useEffect(() => {
    if (!videoId) return;

    let isMounted = true;

    const initPlayer = async () => {
      // Prevent multiple initializations
      if (playerRef.current) return;
      if (!containerRef.current) return;

      try {
        // Load YouTube API
        const YT = await loadScript<YouTubeIframeAPI>(
          YOUTUBE_API_URL,
          YOUTUBE_VARIABLE_NAME
        );

        if (!isMounted || !containerRef.current) return;

        // Wait for API to be ready
        await new Promise<void>((resolve) => {
          if (YT.Player) {
            resolve();
          } else {
            window.onYouTubeIframeAPIReady = () => resolve();
          }
        });

        if (!isMounted || !containerRef.current) return;

        // Check again after async operations
        if (playerRef.current) return;

        // Create player with a unique div ID
        const playerId = playerIdRef.current;
        containerRef.current.id = playerId;

        const player = new YT.Player(playerId, {
          videoId,
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            controls: 0, // Hide YouTube controls (we have custom controls)
            disablekb: 1, // Disable keyboard (we handle it)
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
            iv_load_policy: 3,
            fs: 0, // Hide fullscreen button
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;

              playerRef.current = event.target;
              setIsReady(true);

              // Set muted state if requested
              if (muted) {
                event.target.mute();
              }

              // Initialize video props
              setVideoState({
                duration: event.target.getDuration(),
                volume: event.target.getVolume() / 100,
                paused:
                  event.target.getPlayerState() !== YouTubePlayerState.PLAYING,
                buffering: false, // Clear buffering state when ready
                error: null, // Clear any errors
              });

              // Start polling for time updates
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                  setVideoState({
                    currentTime: playerRef.current.getCurrentTime(),
                  });
                }
              }, 100);

              onReady?.();
            },
            onStateChange: (event) => {
              if (!isMounted) return;

              const state = event.data;
              setVideoState({
                paused: state !== YouTubePlayerState.PLAYING,
                ended: state === YouTubePlayerState.ENDED,
                buffering: state === YouTubePlayerState.BUFFERING,
              });

              // Clear interval when paused or ended
              if (state !== YouTubePlayerState.PLAYING && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              } else if (
                state === YouTubePlayerState.PLAYING &&
                !intervalRef.current
              ) {
                intervalRef.current = setInterval(() => {
                  if (playerRef.current) {
                    setVideoState({
                      currentTime: playerRef.current.getCurrentTime(),
                      volume: playerRef.current.getVolume() / 100,
                    });
                  }
                }, 100);
              }
            },
            onError: (event) => {
              if (!isMounted) return;

              const errorMessages: Record<number, string> = {
                2: 'Invalid video ID',
                5: 'HTML5 player error',
                100: 'Video not found',
                101: 'Video cannot be embedded',
                150: 'Video cannot be embedded',
              };

              setVideoState({
                error: errorMessages[event.data] || 'Unknown error',
              });
            },
          },
        });

        playerRef.current = player;
      } catch (error) {
        console.error('Failed to load YouTube player:', error);
        setVideoState({
          error: 'Failed to load YouTube player',
        });
      }
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
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

    // Create a pseudo video element interface
    const videoInterface = {
      play() {
        player.playVideo();
      },
      pause() {
        player.pauseVideo();
      },
      seekTo(time: number, allowSeekAhead: boolean = true) {
        player.seekTo(time, allowSeekAhead);
      },
      get currentTime() {
        return player.getCurrentTime();
      },
      set currentTime(time: number) {
        player.seekTo(time, true);
      },
      get duration() {
        return player.getDuration();
      },
      get volume() {
        return player.getVolume() / 100;
      },
      set volume(vol: number) {
        player.setVolume(vol * 100);
      },
      get muted() {
        return player.isMuted();
      },
      set muted(mute: boolean) {
        if (mute) {
          player.mute();
        } else {
          player.unMute();
        }
      },
      get paused() {
        return player.getPlayerState() !== YouTubePlayerState.PLAYING;
      },
      get playbackRate() {
        return player.getPlaybackRate();
      },
      set playbackRate(rate: number) {
        player.setPlaybackRate(rate);
      },
    };

    // Store reference for controls to use
    (window as any).__youtubePlayer = videoInterface;

    return () => {
      delete (window as any).__youtubePlayer;
    };
  }, [isReady]);

  if (!videoId) {
    return (
      <div className={styles.error}>
        <p>Invalid YouTube video ID</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.player} />
    </div>
  );
});

YouTubePlayer.displayName = 'YouTubePlayer';
