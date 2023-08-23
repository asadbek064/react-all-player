import React from 'react';
import { SubtitleSettingsProvider } from './SubtitleSettingsContext';
import { VideoInteractingContextProvider } from './VideoInteractingContext';
import { react-all-playerProps, VideoPropsProvider } from './VideoPropsContext';
import { VideoStateContextProvider } from './VideoStateContext';

const GlobalContext: React.FC<react-all-playerProps> = ({
  sources,
  subtitles = [],
  children,
  ...props
}) => {
  return (
    <VideoPropsProvider sources={sources} subtitles={subtitles} {...props}>
      <VideoStateContextProvider>
        <VideoInteractingContextProvider>
          <SubtitleSettingsProvider>{children}</SubtitleSettingsProvider>
        </VideoInteractingContextProvider>
      </VideoStateContextProvider>
    </VideoPropsProvider>
  );
};

export default GlobalContext;
