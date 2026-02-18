
import React, { useEffect, useRef, useState } from 'react';
import { EngineState } from '../types';

interface VideoEngineProps {
  imageSrc: string;
  transitionSrc: string | null;
  engineState: EngineState;
  onTransitionEnd: () => void;
  muted: boolean;
}

export const VideoEngine: React.FC<VideoEngineProps> = ({
  imageSrc,
  transitionSrc,
  engineState,
  onTransitionEnd,
  muted
}) => {
  const transitionVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload background image - don't reset imageLoaded if we are transitioning
  // because the video covers the swap anyway.
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    
    if (img.complete) {
      setImageLoaded(true);
    } else {
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        console.error("Failed to load background image:", imageSrc);
        setImageLoaded(true); 
      };
    }
  }, [imageSrc]);

  useEffect(() => {
    if (engineState === EngineState.TRANSITION && transitionSrc) {
      setIsVideoReady(false);
      const video = transitionVideoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.load(); 
      }
    } else if (engineState === EngineState.IDLE) {
      // Small cleanup delay
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIsVideoReady(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [engineState, transitionSrc]);

  const handleCanPlay = () => {
    if (engineState === EngineState.TRANSITION) {
      // Add a tiny buffer for browser rendering before showing video
      setTimeout(() => {
        setIsVideoReady(true);
        setIsTransitioning(true);
        if (transitionVideoRef.current) {
          transitionVideoRef.current.play().catch(err => {
            console.warn("Autoplay blocked:", err?.message);
            onTransitionEnd();
          });
        }
      }, 50);
    }
  };

  const handleTransitionEnded = () => {
    // We let the engine state change in App.tsx
    onTransitionEnd();
  };

  const handleVideoError = () => {
    console.error("Video playback error for:", transitionSrc);
    setIsTransitioning(false);
    onTransitionEnd();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-void z-0 overflow-hidden pointer-events-none select-none">
      
      {/* SCENE LAYER (Static background) */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundColor: '#050505',
          backgroundImage: `url("${imageSrc}")`,
          // Note: Removing blur during transition to prevent the "glow" around video edges
          zIndex: 5
        }}
      />

      {/* TRANSITION LAYER (Video) */}
      {transitionSrc && (
        <video
          key={transitionSrc}
          ref={transitionVideoRef}
          src={transitionSrc}
          muted={muted}
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          onCanPlay={handleCanPlay}
          onEnded={handleTransitionEnded}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${
            isTransitioning && isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* OVERLAY EFFECTS */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60 background-scanlines"></div>
      
      {/* LOADING INDICATOR */}
      {engineState === EngineState.TRANSITION && !isVideoReady && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300">
           <div className="flex flex-col items-center gap-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-accent/10 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="font-mono text-[10px] text-accent tracking-[0.4em] uppercase animate-pulse">Syncing...</span>
           </div>
        </div>
      )}
    </div>
  );
};
