import * as React from 'react';
import ControlButton from './ControlButton';
import PlayIcon from '../icons/PlayIcon';
import PauseIcon from '../icons/PauseIcon';
import { useVideo } from '../../contexts/VideoContext';
import LoadingIcon from '../icons/LoadingIcon';
import PlayIndicator from '../Indicator/PlayIndicator';
import PauseIndicator from '../Indicator/PauseIndicator';
import { IndicatorRef } from '../Indicator/Indicator';
import { stringInterpolate } from '../../utils';
import { useVideoProps } from '../../contexts/VideoPropsContext';
import useHotKey, { parseHotKey } from '../../hooks/useHotKey';

const PlayPauseButton = () => {
  const playIndicator = React.useRef<IndicatorRef>(null);
  const pauseIndicator = React.useRef<IndicatorRef>(null);

  const hotkey = useHotKey('playPause');
  const { i18n } = useVideoProps();
  const { videoState, videoEl } = useVideo();

  const handleClick = () => {
    // Handle embedded players (YouTube/Vimeo)
    if (!videoEl) {
      // Try YouTube player
      const youtubePlayer = (window as any).__youtubePlayer;
      if (youtubePlayer) {
        if (videoState.paused) {
          playIndicator.current?.show();
          youtubePlayer.play();
        } else {
          pauseIndicator.current?.show();
          youtubePlayer.pause();
        }
        return;
      }

      // Try Vimeo player
      const vimeoPlayer = (window as any).__vimeoPlayer;
      if (vimeoPlayer) {
        if (videoState.paused) {
          playIndicator.current?.show();
          vimeoPlayer.play();
        } else {
          pauseIndicator.current?.show();
          vimeoPlayer.pause();
        }
        return;
      }

      return;
    }

    // Handle standard HTML5 video
    if (videoState.paused) {
      playIndicator.current?.show();
      videoEl.play();
    } else {
      pauseIndicator.current?.show();
      videoEl.pause();
    }
  };

  return (
    <ControlButton
      tooltip={
        videoState.paused
          ? stringInterpolate(i18n.controls.play, {
              shortcut: parseHotKey(hotkey?.hotKey),
            })
          : stringInterpolate(i18n.controls.pause, {
              shortcut: parseHotKey(hotkey?.hotKey),
            })
      }
      onClick={handleClick}
    >
      {videoState.buffering ? (
        <LoadingIcon />
      ) : videoState.paused ? (
        <PlayIcon />
      ) : (
        <PauseIcon />
      )}

      <PlayIndicator ref={playIndicator} />
      <PauseIndicator ref={pauseIndicator} />
    </ControlButton>
  );
};

export default React.memo(PlayPauseButton);
