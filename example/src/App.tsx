import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import editorTheme from 'prism-react-renderer/themes/nightOwl'
import Player from 'react-all-player'
import { buildAbsoluteURL } from 'url-toolkit'

const initialCode = `
  <Player
    sources={[
      {
        file: 'https://huggingface.co/datasets/light064/ReactAllPlayer/resolve/main/View_From_A_Blue_Moon_Trailer-1080p.mp4'
      }
    ]}
    subtitles={[
      {
        lang: 'en',
        language: 'English',
        file: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt'
      },
      {
        lang: 'fr',
        language: 'French ',
        file: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt'
      }
    ]}
    className="object-contain w-full h-full"
    autoPlay
    muted
  />
`

const App: React.FC = () => {
  return (
    <div className="text-white w-full h-full gap-4">
      <LiveProvider
        theme={editorTheme}
        scope={{ Player, buildAbsoluteURL }}
        code={initialCode}
      >
        <div
          className="relative w-full h-[56.25vw] bg-black"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          <LivePreview className="w-full h-full" />
        </div>

        <LiveEditor
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16
          }}
          className="bg-[#0B0E14]"
        />
        <LiveError />
      </LiveProvider>
    </div>
  )
}

export default App
