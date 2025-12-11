import * as React from 'react';

import { useVideo } from '../../../contexts/VideoContext';
import { useVideoProps } from '../../../contexts/VideoPropsContext';
import PlaybackSpeedIcon from '../../icons/PlaybackSpeedIcon';
import NestedMenu from '../../NestedMenu';

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const PlaybackSpeedMenu = () => {
  const { videoEl } = useVideo();
  const { i18n } = useVideoProps();

  // Get current speed from HTML5 video or embedded players
  let currentSpeed = 1;
  if (videoEl) {
    currentSpeed = videoEl.playbackRate;
  } else {
    const yt = (window as any).__youtubePlayer;
    const vimeo = (window as any).__vimeoPlayer;
    if (yt) {
      currentSpeed = yt.playbackRate || 1;
    } else if (vimeo) {
      currentSpeed = vimeo.playbackRate || 1;
    }
  }

  const handleChangeSpeed = (value: string) => {
    const rate = Number(value);

    // Handle embedded players (YouTube/Vimeo)
    if (!videoEl) {
      const yt = (window as any).__youtubePlayer;
      if (yt) {
        yt.playbackRate = rate;
        return;
      }

      const vimeo = (window as any).__vimeoPlayer;
      if (vimeo) {
        vimeo.playbackRate = rate;
        return;
      }

      return;
    }

    // Handle standard HTML5 video
    videoEl.playbackRate = rate;
  };

  return (
    <NestedMenu.SubMenu
      menuKey="speed"
      title={i18n.settings.playbackSpeed}
      activeItemKey={currentSpeed.toString()}
      icon={<PlaybackSpeedIcon />}
      onChange={handleChangeSpeed}
    >
      {speeds.map((speed) => (
        <NestedMenu.Item
          key={speed}
          itemKey={speed.toString()}
          title={`${speed}x`}
          value={speed.toString()}
        />
      ))}
    </NestedMenu.SubMenu>
  );
};

export default React.memo(PlaybackSpeedMenu);
