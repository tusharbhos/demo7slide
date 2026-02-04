'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
}

export default function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const playVideo = async () => {
      if (!videoRef.current) return;

      try {
        // Start muted for autoplay compatibility
        videoRef.current.muted = true;
        videoRef.current.volume = 0.5;
        
        await videoRef.current.play();
        setIsPlaying(true);
        
        // Try to unmute after 1 second (for user interaction)
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
          }
        }, 1000);
      } catch (error) {
        console.log('Auto-play failed:', error);
      }
    };

    playVideo();

    // Add click to play if paused
    const handlePageClick = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    };

    document.addEventListener('click', handlePageClick);
    return () => document.removeEventListener('click', handlePageClick);
  }, [videoSrc]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      className="fixed top-6 right-6 w-[270px] h-[170px] bg-black rounded-lg overflow-hidden shadow-lg z-50"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            title="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Video Status Indicator */}
      <div className="absolute top-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
        {isMuted ? 'MUTED' : 'SOUND ON'}
      </div>
    </div>
  );
}