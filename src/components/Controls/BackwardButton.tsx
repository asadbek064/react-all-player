import React from 'react';
import ControlButton from './ControlButton';
import BackwardIcon from '../icons/BackwardIcon';
import { useVideo } from '../../contexts/VideoContext';
import BackwardIndicator from '../Indicator/BackwardIndicator';
import { IndicatorRef } from '../Indicator/Indicator';
import { useVideoProps } from '../../contexts/VideoPropsContext';
import { stringInterpolate } from '../../utils';

const SEEK_SECONDS = 10;

const BackwardButton = () => {
  const { videoEl } = useVideo();
  const { i18n } = useVideoProps();
  const backwardIndicator = React.useRef<IndicatorRef>(null);

  const handleClick = () => {
    backwardIndicator.current?.show();

    if (videoEl) {
      videoEl.currentTime = Math.max(0, videoEl.currentTime - SEEK_SECONDS);
      return;
    }

    const yt = (window as any).__youtubePlayer;
    if (yt) {
      yt.seekTo(Math.max(0, yt.currentTime - SEEK_SECONDS), true);
      return;
    }

    const vimeo = (window as any).__vimeoPlayer;
    if (vimeo) {
      vimeo.setCurrentTime(Math.max(0, vimeo.currentTime - SEEK_SECONDS));
    }
  };

  return (
    <ControlButton
      tooltip={stringInterpolate(i18n.controls.backward, { time: 10 })}
      onClick={handleClick}
    >
      <BackwardIcon />

      <BackwardIndicator ref={backwardIndicator} />
    </ControlButton>
  );
};

export default BackwardButton;
