import './global.css';
import './reset.css';

import * as React from 'react';
import GlobalContext from './contexts/GlobalContext';
import { VideoContextProvider } from './contexts/VideoContext';
import { ReactVidPlayerProps } from './contexts/VideoPropsContext';
import DefaultUI from './components/DefaultUI';

const InnerPlayer = React.forwardRef<HTMLVideoElement, ReactVidPlayerProps>(
  ({ hlsRef = React.createRef(), children, ...props }, ref) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);

    const playerRef = React.useCallback(
      (node) => {
        videoRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLVideoElement>).current = node;
        }
      },
      [ref]
    );

    return (
      <VideoContextProvider videoRef={videoRef} hlsRef={hlsRef}>
        {children || <DefaultUI ref={playerRef} {...props} />}
      </VideoContextProvider>
    );
  }
);

const ReactVidPlayer = React.forwardRef<HTMLVideoElement, ReactVidPlayerProps>(
  (
    { sources, subtitles = [], hlsRef = React.createRef(), children, ...props },
    ref
  ) => {
    return (
      <GlobalContext sources={sources} subtitles={subtitles} {...props}>
        <InnerPlayer
          sources={sources}
          subtitles={subtitles}
          hlsRef={hlsRef}
          ref={ref}
          {...props}
        >
          {children}
        </InnerPlayer>
      </GlobalContext>
    );
  }
);

InnerPlayer.displayName = 'InnerPlayer';
ReactVidPlayer.displayName = 'react-vid-player';

export * from './components';
export * from './hooks';
export * from './hotkeys';
export * from './contexts';

export default ReactVidPlayer;
