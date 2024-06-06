"use client";
import { useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const VideoSection = () => {
  const videoRef: any = useRef(null);

  const handlePlayAndFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      video.play();
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  };

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
    <section className="bg-snow py-24">
      <div className="mobile:w-[94%] max-w-[90%]  mobile:max-w-desktop mx-auto flex flex-col gap-5">
        <p className="text-xl text-charcoalGray font-bold text-center">
          Analogueshifts Training
        </p>
        <h2 className="text-charcoalGray text-center font-bold text-2xl laptop:text-6xl leading-[1.2em]">
          Courses, <span className="text-lightYellow">But Better</span>
        </h2>
        <div className="w-full mt-5 mobile:h-[500px] h-[350px] max-[500px]:h-[250px]  rounded-3xl flex overflow-hidden justify-center bg-white relative">
          {/* <div className="absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center">
            <button
              onClick={handlePlayAndFullscreen}
              className="cursor-pointer z-20 bg-none outline-none"
            >
              <Play className="mobile:w-20 mobile:h-20 w-10 text-lightYellow" />
            </button>
          </div>
          <video
            ref={videoRef}
            className="w-[350px] h-max mobile:max-h-[800px] -translate-y-20 max-h-[270px]"
          >
            <source src="/videos/intro.mp4" type="video/mp4" />
          </video> */}
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/gY2FEaYoTXA?si=zvUgbGULr4NUs0Tw"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
