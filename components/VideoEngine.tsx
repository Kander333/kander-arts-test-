
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

  useEffect(() => {
    if (engineState === EngineState.TRANSITION && transitionSrc) {
      setIsVideoReady(false);
      const video = transitionVideoRef.current;
      if (video) {
        video.currentTime = 0;
        video.load(); // Принудительная загрузка для внешних URL
      }
    } else if (engineState === EngineState.IDLE) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIsVideoReady(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [engineState, transitionSrc]);

  const handleCanPlay = () => {
    setIsVideoReady(true);
    setIsTransitioning(true);
    if (transitionVideoRef.current) {
      transitionVideoRef.current.play().catch(err => {
        console.warn("Autoplay failed:", err?.message || "Unknown error");
        onTransitionEnd();
      });
    }
  };

  const handleTransitionEnded = () => {
    onTransitionEnd();
  };

  const handleVideoError = () => {
    // Исправление: не передаем объект события (e) в console.error, чтобы избежать циклических ссылок
    console.error("Video Engine Error loading path:", transitionSrc);
    setIsTransitioning(false);
    onTransitionEnd();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-void z-0 overflow-hidden pointer-events-none">
      
      {/* СЛОЙ СЦЕНЫ (Статичное изображение) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700"
        style={{ 
          backgroundImage: `url("${imageSrc}")`,
          // Если видео готово и идет переход, затемняем картинку сильнее
          opacity: isTransitioning && isVideoReady ? 0.1 : 1,
          zIndex: 5
        }}
      />

      {/* СЛОЙ ПЕРЕХОДА (Видео) */}
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
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${
            isTransitioning && isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* ЭФФЕКТЫ ПОВЕРХ */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-150 contrast-150 mix-blend-overlay"></div>
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20 background-scanlines"></div>
      
      {/* ИНДИКАТОР ЗАГРУЗКИ (для медленных ссылок) */}
      {engineState === EngineState.TRANSITION && !isVideoReady && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
           <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-[10px] text-accent tracking-[0.3em] uppercase animate-pulse">Buffering_Stream...</span>
           </div>
        </div>
      )}
    </div>
  );
};
