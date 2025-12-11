import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import styles from './Overlay.module.css';

const Overlay = () => {
  const { videoEl, videoState } = useVideo();

  const handleToggleVideo = () => {
    // Handle embedded players (YouTube/Vimeo)
    if (!videoEl) {
      // Try YouTube player
      const youtubePlayer = (window as any).__youtubePlayer;
      if (youtubePlayer) {
        if (youtubePlayer.paused) {
          youtubePlayer.play();
        } else {
          youtubePlayer.pause();
        }
        return;
      }

      // Try Vimeo player
      const vimeoPlayer = (window as any).__vimeoPlayer;
      if (vimeoPlayer) {
        if (videoState.paused) {
          vimeoPlayer.play();
        } else {
          vimeoPlayer.pause();
        }
        return;
      }

      return;
    }

    // Handle standard HTML5 video
    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  return (
    <div onClick={handleToggleVideo} className={styles.overlayContainer}></div>
  );
};

export default Overlay;
