import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import Player from 'react-all-player'
import { buildAbsoluteURL } from 'url-toolkit'
import YouTubeVimeoDemo from './youtube-vimeo-demo'
const examples = {
  example1: `
// Example 1: MP4 Video with Subtitles
<Player
  sources={[
    { file: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }
  ]}
  subtitles={[
    { lang: 'en', language: 'English', file: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt' },
    { lang: 'fr', language: 'French', file: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt' }
  ]}
  className="object-contain w-full h-full"
  muted
  poster="https://pub-1ee15f86c7e94066bcff56e6e7ce5c02.r2.dev/View_From_A_Blue_Moon_Trailer-HD.jpg"
/>
`,
  example2: `
<Player
  sources={[{ file: 'bTqVqk7FSmY', type: 'youtube' }]}
  className="object-contain w-full h-full"
/>
`,
  example3: `
// Example 3: YouTube Video (using full URL)
<Player
  sources={[{ file: 'https://www.youtube.com/watch?v=bTqVqk7FSmY' }]}
  className="object-contain w-full h-full"
/>
`,
  example4: `
// Example 4: Vimeo Video (using video ID)
<Player
  sources={[{ file: '76979871', type: 'vimeo' }]}
  className="object-contain w-full h-full"
/>
`,
  example5: `
// Example 5: Vimeo Video (using full URL)
<Player
  sources={[{ file: 'https://vimeo.com/76979871' }]}
  className="object-contain w-full h-full"
/>
`
}
const App: React.FC = () => {
  return (
    <div className="text-white w-full h-full gap-4">
      <LiveProvider
        scope={{ Player, buildAbsoluteURL }}
        code={examples.example2}
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
        <YouTubeVimeoDemo />
    </div>
  )
}

export default App
