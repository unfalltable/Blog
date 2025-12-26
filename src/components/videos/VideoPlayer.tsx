'use client';

import { Video } from '@/types';

interface VideoPlayerProps {
  video: Video;
}

/**
 * VideoPlayer component renders an inline video player for embedded videos
 * Requirements: 5.2, 5.4
 */
export function VideoPlayer({ video }: VideoPlayerProps) {
  // Check if the source is a YouTube URL
  const isYouTube =
    video.source.includes('youtube.com') || video.source.includes('youtu.be');

  // Check if the source is a Vimeo URL
  const isVimeo = video.source.includes('vimeo.com');

  // Check if the source is a Bilibili URL
  const isBilibili = video.source.includes('bilibili.com');

  // Extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract Vimeo video ID
  const getVimeoId = (url: string): string | null => {
    const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Extract Bilibili video ID (BV number)
  const getBilibiliId = (url: string): string | null => {
    const regExp = /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Render YouTube embed
  if (isYouTube) {
    const videoId = getYouTubeId(video.source);
    if (videoId) {
      return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }
  }

  // Render Vimeo embed
  if (isVimeo) {
    const videoId = getVimeoId(video.source);
    if (videoId) {
      return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }
  }

  // Render Bilibili embed
  if (isBilibili) {
    const videoId = getBilibiliId(video.source);
    if (videoId) {
      return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={`//player.bilibili.com/player.html?bvid=${videoId}&high_quality=1`}
            title={video.title}
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            scrolling="no"
            frameBorder="0"
          />
        </div>
      );
    }
  }

  // Check if source is already an embed code (iframe)
  if (video.source.includes('<iframe')) {
    return (
      <div
        className="relative aspect-video w-full bg-black rounded-lg overflow-hidden [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
        dangerouslySetInnerHTML={{ __html: video.source }}
      />
    );
  }

  // Default: render as HTML5 video
  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
      <video
        src={video.source}
        title={video.title}
        controls
        className="absolute inset-0 w-full h-full"
        poster={video.thumbnail || undefined}
      >
        <track kind="captions" />
        您的浏览器不支持视频播放
      </video>
    </div>
  );
}
