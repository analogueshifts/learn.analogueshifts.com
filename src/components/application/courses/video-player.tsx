"use client";

import { useEffect, useRef } from "react";
import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

interface VideoPlayerProps {
  src: string;
  title: string;
  courseId: string;
  lessonId: string;
  poster?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export default function VideoPlayer({ src, title, courseId, lessonId, poster, onEnded, autoPlay }: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);

  // Save/Load progress from localStorage
  useEffect(() => {
    const storageKey = `vid_progress_${courseId}_${lessonId}`;
    
    const handleTimeUpdate = () => {
      if (playerRef.current) {
        localStorage.setItem(storageKey, playerRef.current.currentTime.toString());
      }
    };

    const handleCanPlay = () => {
      const savedTime = localStorage.getItem(storageKey);
      if (savedTime && playerRef.current) {
        playerRef.current.currentTime = parseFloat(savedTime);
      }
    };

    const player = playerRef.current;
    if (player) {
      player.addEventListener("time-update", handleTimeUpdate);
      player.addEventListener("can-play", handleCanPlay);
      if (onEnded) {
        player.addEventListener("ended", onEnded);
      }
      
      return () => {
        player.removeEventListener("time-update", handleTimeUpdate);
        player.removeEventListener("can-play", handleCanPlay);
        if (onEnded) {
          player.removeEventListener("ended", onEnded);
        }
      };
    }
  }, [courseId, lessonId, onEnded]);

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
      <MediaPlayer
        ref={playerRef}
        title={title}
        src={src}
        poster={poster}
        aspectRatio="16/9"
        crossOrigin
        className="w-full h-full rounded-xl overflow-hidden"
        autoPlay={autoPlay}
      >
        <MediaProvider />
        <DefaultVideoLayout 
          icons={defaultLayoutIcons} 
          thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" 
        />
      </MediaPlayer>
    </div>
  );
}
