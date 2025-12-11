/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - Just the video ID itself
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // If it's already just an ID (11 characters, alphanumeric with dashes and underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts Vimeo video ID from various Vimeo URL formats
 * Supports:
 * - https://vimeo.com/VIDEO_ID
 * - https://player.vimeo.com/video/VIDEO_ID
 * - Just the video ID itself
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;

  // If it's already just a numeric ID
  if (/^\d+$/.test(url)) {
    return url;
  }

  // Try to extract from various Vimeo URL formats
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Checks if a source should use YouTube embed
 */
export function isYouTubeSource(source: { file: string; type?: string }): boolean {
  return (
    source.type === 'youtube' ||
    source.file.includes('youtube.com') ||
    source.file.includes('youtu.be')
  );
}

/**
 * Checks if a source should use Vimeo embed
 */
export function isVimeoSource(source: { file: string; type?: string }): boolean {
  return (
    source.type === 'vimeo' ||
    source.file.includes('vimeo.com')
  );
}
