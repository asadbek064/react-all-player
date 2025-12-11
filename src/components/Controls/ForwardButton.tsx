import * as React from 'react';
import ControlButton from './ControlButton';
import ForwardIcon from '../icons/ForwardIcon';
import { useVideo } from '../../contexts/VideoContext';
import { IndicatorRef } from '../Indicator/Indicator';
import ForwardIndicator from '../Indicator/ForwardIndicator';
import { useVideoProps } from '../../contexts/VideoPropsContext';
import { stringInterpolate } from '../../utils';

const SEEK_SECONDS = 10;

const ForwardButton = () => {
  const { videoEl } = useVideo();
  const { i18n } = useVideoProps();
  const forwardIndicator = React.useRef<IndicatorRef>(null);

  const handleClick = () => {
    forwardIndicator.current?.show();

    if (videoEl) {
      videoEl.currentTime += SEEK_SECONDS;
      return;
    }

    const yt = (window as any).__youtubePlayer;
    if (yt) {
      yt.seekTo(yt.currentTime + SEEK_SECONDS, true);
      return;
    }

    const vimeo = (window as any).__vimeoPlayer;
    if (vimeo) {
      vimeo.setCurrentTime(vimeo.currentTime + SEEK_SECONDS);
    }
  };

  return (
    <ControlButton
      tooltip={stringInterpolate(i18n.controls.forward, { time: 10 })}
      onClick={handleClick}
    >
      <ForwardIcon />

      <ForwardIndicator ref={forwardIndicator} />
    </ControlButton>
  );
};

export default React.memo(ForwardButton);
