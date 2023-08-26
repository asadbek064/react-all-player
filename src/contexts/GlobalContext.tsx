import React from 'react';
import { SubtitleSettingsProvider } from './SubtitleSettingsContext';
import { VideoInteractingContextProvider } from './VideoInteractingContext';
import { ReactVidPlayerProps, VideoPropsProvider } from './VideoPropsContext';
import { VideoStateContextProvider } from './VideoStateContext';

const GlobalContext: React.FC<ReactVidPlayerProps> = ({
  sources,
  subtitles = [],
  placeholder,
  children,
  ...props
}) => {
  return (
    <VideoPropsProvider
      sources={sources}
      subtitles={subtitles}
      placeholder={placeholder}
      {...props}
    >
      <VideoStateContextProvider>
        <VideoInteractingContextProvider>
          <SubtitleSettingsProvider>{children}</SubtitleSettingsProvider>
        </VideoInteractingContextProvider>
      </VideoStateContextProvider>
    </VideoPropsProvider>
  );
};

export default GlobalContext;
