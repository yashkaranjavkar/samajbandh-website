/**
 * Turns any YouTube link into an embeddable player URL, so videos play inside the page.
 *
 * Accepts the usual link formats, e.g.
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 * Non-YouTube URLs are returned unchanged.
 */
export const toYouTubeEmbedUrl = (url: string, { autoplay = false } = {}): string => {
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (!match) return url;

  const params = new URLSearchParams({
    rel: '0',            // related videos only from the same channel
    modestbranding: '1', // smaller YouTube logo
    playsinline: '1',    // play inside the page on iPhones instead of going fullscreen
    ...(autoplay ? { autoplay: '1' } : {})
  });
  return `https://www.youtube-nocookie.com/embed/${match[1]}?${params}`;
};
