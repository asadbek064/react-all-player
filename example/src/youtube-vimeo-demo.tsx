import * as React from 'react'
import ReactAllPlayer from 'react-all-player'
export default function YouTubeVimeoDemo() {
  const [platform, setPlatform] = React.useState<'youtube' | 'vimeo'>('youtube')

  const players = {
    youtube: { id: 'yt-1', file: 'bTqVqk7FSmY', type: 'youtube' as const },
    vimeo: { id: 'vm-1', file: '76979871', type: 'vimeo' as const }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <select
        className="border px-2 py-1 rounded"
        value={platform}
        onChange={(e) => setPlatform(e.target.value as 'youtube' | 'vimeo')}
      >
        <option value="youtube">YouTube</option>
        <option value="vimeo">Vimeo</option>
      </select>

      <div className='overflow-hidden rounded-lg shadow-md relative"'>
        <ReactAllPlayer
          id={players[platform].id}
          sources={[
            { file: players[platform].file, type: players[platform].type }
          ]}
        />
      </div>
    </div>
  )
}
