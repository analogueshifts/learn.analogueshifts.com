"use client";
import { useRef, useEffect } from "react";

const VideoSection = () => {
  const videoRef: any = useRef(null);

  const handleFullscreenChange = () => {
    const video = videoRef.current;
    if (video && !document.fullscreenElement) {
      video.pause();
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div className="w-full mobile:h-[475px] h-[350px] max-[500px]:h-[250px]  rounded-3xl flex overflow-hidden justify-center bg-white relative">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/gY2FEaYoTXA?si=zvUgbGULr4NUs0Tw"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoSection;
