import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useVideo } from '../../../contexts/VideoContext';
import { classNames, convertTime } from '../../../utils';
import { isDesktop } from '../../../utils/device';
import Slider from '../../Slider';
import ThumbnailHover from '../ThumbnailHover';
import styles from './ProgressSlider.module.css';

const ProgressSlider = () => {
  const { videoEl, setVideoState, videoState } = useVideo();
  const [bufferPercent, setBufferPercent] = useState(0);
  const [hoverPercent, setHoverPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const seekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded
  useEffect(() => {
    if (!videoEl) return;

    const handleProgressBuffer = () => {
      const buffer = videoEl.buffered;

      if (!buffer.length) return;
      if (!videoEl.duration) return;

      const bufferedTime = buffer.end(buffer.length - 1);
      const bufferedPercent = (bufferedTime / videoEl.duration) * 100;

      setBufferPercent(bufferedPercent);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
    };

    videoEl.addEventListener('progress', handleProgressBuffer);
    videoEl.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoEl.removeEventListener('progress', handleProgressBuffer);
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoEl]);

  // Update currentTime from videoState for embedded players
  useEffect(() => {
    if (!videoEl && videoState.currentTime !== undefined) {
      setCurrentTime(videoState.currentTime);
    }
  }, [videoEl, videoState.currentTime]);

  const currentPercent = useMemo(() => {
    // Get duration from videoState (works for both HTML5 and embedded players)
    const duration = videoState.duration || videoEl?.duration;
    if (!duration) return 0;

    return (currentTime / duration) * 100;
  }, [currentTime, videoState.duration, videoEl?.duration]);

  const handlePercentIntent = useCallback((percent: number) => {
    setHoverPercent(percent);
  }, []);

  const handlePercentChange = useCallback(
    (percent: number) => {
      // Handle embedded players (YouTube/Vimeo)
      if (!videoEl) {
        const youtubePlayer = (window as any).__youtubePlayer;
        const vimeoPlayer = (window as any).__vimeoPlayer;

        const player = youtubePlayer || vimeoPlayer;
        if (!player?.duration) return;

        const newTime = (percent / 100) * player.duration;

        if (seekTimeout.current) clearTimeout(seekTimeout.current);
        seekTimeout.current = setTimeout(() => {
          if (youtubePlayer) youtubePlayer.seekTo(newTime, true);
          if (vimeoPlayer) vimeoPlayer.setCurrentTime(newTime);
          player.play?.();
        }, 50);

        setCurrentTime(newTime);
        setVideoState({ seeking: false });
        return;
      }

      // Handle standard HTML5 video
      if (!videoEl?.duration) return;

      const newTime = (percent / 100) * videoEl.duration;

      videoEl.currentTime = newTime;

      if (videoEl.paused) {
        videoEl.play();
      }

      setVideoState({ seeking: false });
      setCurrentTime(newTime);
    },
    [setVideoState, videoEl]
  );

  const handleDragStart = useCallback(() => {
    setVideoState({ seeking: true });
  }, [setVideoState]);

  const handleDragEnd = useCallback(() => {
    setVideoState({ seeking: true });
  }, [setVideoState]);

  const handlePercentChanging = useCallback(
    (percent) => {
      // Handle embedded players (YouTube/Vimeo)
      if (!videoEl) {
        // Try YouTube player
        const youtubePlayer = (window as any).__youtubePlayer;
        if (youtubePlayer && youtubePlayer.duration) {
          if (!youtubePlayer.paused) {
            youtubePlayer.pause();
          }

          const newTime = (percent / 100) * youtubePlayer.duration;

          setVideoState({ seeking: true });
          setCurrentTime(newTime);
          return;
        }

        // Try Vimeo player
        const vimeoPlayer = (window as any).__vimeoPlayer;
        if (vimeoPlayer && vimeoPlayer.duration) {
          if (!vimeoPlayer.paused) {
            vimeoPlayer.pause();
          }

          const newTime = (percent / 100) * vimeoPlayer.duration;

          setVideoState({ seeking: true });
          setCurrentTime(newTime);
          return;
        }

        return;
      }

      // Handle standard HTML5 video
      if (!videoEl?.duration) return;

      if (!videoEl.paused) {
        videoEl.pause();
      }

      const newTime = (percent / 100) * videoEl.duration;

      setVideoState({ seeking: true });
      setCurrentTime(newTime);
    },
    [setVideoState, videoEl]
  );

  return (
    <Slider
      className={classNames(styles.container, isDesktop && styles.desktop)}
      onPercentIntent={handlePercentIntent}
      onPercentChange={handlePercentChange}
      onPercentChanging={handlePercentChanging}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.innerContainer}>
        <Slider.Bar className={styles.hoverBar} percent={hoverPercent} />
        <Slider.Bar className={styles.bufferBar} percent={bufferPercent} />
        <Slider.Bar className={styles.playBar} percent={currentPercent} />
        <Slider.Bar className={styles.backgroundBar} />
        <Slider.Dot className={styles.dot} percent={currentPercent} />

        <ThumbnailHover hoverPercent={hoverPercent} />

        {!!hoverPercent && (videoState.duration || videoEl?.duration) && (
          <div
            className={styles.hoverTime}
            style={{ left: hoverPercent + '%' }}
          >
            {convertTime(
              (hoverPercent / 100) *
                (videoState.duration || videoEl?.duration || 0)
            )}
          </div>
        )}
      </div>
    </Slider>
  );
};

export default ProgressSlider;
