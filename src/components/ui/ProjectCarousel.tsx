"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CyberProjectCard, Project } from './CyberProjectCard';

interface ProjectCarouselProps {
  projects: Project[];
}

const ShardEffect = ({ mode, color }: { mode: 'shatter' | 'reconstruct', color: string }) => {
  const shards = React.useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      angle: (Math.random() - 0.5) * 360,
      distance: 150 + Math.random() * 250,
      size: 20 + Math.random() * 40,
      rotation: Math.random() * 360,
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 80,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-visible">
      <AnimatePresence>
        {shards.map((shard) => (
          <motion.div
            key={shard.id}
            className="absolute"
            style={{
              left: `${50 + shard.x}%`,
              top: `${50 + shard.y}%`,
              width: `${shard.size}px`,
              height: `${shard.size}px`,
              background: `linear-gradient(${shard.rotation}deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`,
              backdropFilter: "blur(5px)",
              border: `1px solid ${color}60`,
              boxShadow: `0 4px 15px rgba(0,0,0,0.2), inset 0 0 10px ${color}30`,
              clipPath: "polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%)",
            }}
            initial={mode === 'shatter' ? {
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 1,
              scale: 1,
            } : {
              x: Math.cos((shard.angle * Math.PI) / 180) * shard.distance,
              y: Math.sin((shard.angle * Math.PI) / 180) * shard.distance,
              rotate: shard.rotation + 180,
              opacity: 0,
              scale: 0.5,
            }}
            animate={mode === 'shatter' ? {
              x: Math.cos((shard.angle * Math.PI) / 180) * shard.distance,
              y: Math.sin((shard.angle * Math.PI) / 180) * shard.distance,
              rotate: shard.rotation + 360,
              opacity: 0,
              scale: 0.5,
            } : {
              x: 0,
              y: 0,
              rotate: 0,
              opacity: [0, 1, 1, 0], // Slower fade in/out sequence
              scale: [0.3, 1.1, 1, 0.8],
            }}
            transition={{
              duration: mode === 'shatter' ? 1.2 : 1.8,
              ease: mode === 'shatter' ? "circOut" : "easeInOut",
              times: mode === 'reconstruct' ? [0, 0.2, 0.8, 1] : undefined
            }}
          />
        ))}
      </AnimatePresence>
      {/* Impact Flash */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.5, 2.5, 3] }}
        transition={{ duration: mode === 'shatter' ? 0.6 : 1.2 }}
      />
    </div>
  );
};

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); 

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const themeColor = "#00F0FF";

  return (
    <div className="relative w-full max-w-6xl mx-auto min-h-[500px] md:h-[600px] flex flex-col md:flex-row items-center justify-center pt-10 md:pt-20">
      <div className="relative w-full h-[420px] md:h-[450px]">
        <AnimatePresence initial={false} custom={direction}>
          {projects.map((project, index) => {
            const offset = (index - currentIndex + projects.length) % projects.length;
            const isCenter = offset === 0;
            const isRight = offset === 1 || (offset === projects.length - 1 && projects.length === 2);
            const isLeft = offset === projects.length - 1;

            if (!isCenter && !isRight && !isLeft && projects.length > 3) return null;

            return (
              <motion.div
                key={`${project.title}-${index}`}
                custom={direction}
                initial={(dir: number) => ({ 
                  opacity: 0, 
                  scale: dir < 0 ? 0.95 : 0.8,
                  x: dir > 0 ? 300 : dir < 0 ? 0 : -300,
                  zIndex: 0
                })}
                animate={{
                  opacity: isCenter ? 1 : 0.4,
                  scale: isCenter ? 1 : isMobile ? 0.7 : 0.85,
                  x: isCenter ? 0 : offset === 1 ? (isMobile ? 60 : 160) : offset === projects.length - 1 ? (isMobile ? -60 : -160) : 0,
                  zIndex: isCenter ? 30 : 10,
                  filter: isCenter ? "blur(0px)" : "blur(4px)",
                  rotateY: isCenter ? 0 : offset === 1 ? -15 : 15,
                }}
                exit={(dir: number) => ({ 
                  opacity: 0, 
                  scale: dir > 0 ? 1 : 0.5,
                  x: dir > 0 ? 0 : dir < 0 ? -300 : 300,
                  transition: { duration: dir > 0 ? 1.2 : 0.6 }
                })}
                transition={isCenter && direction < 0 ? {
                  duration: 1.8,
                  ease: "easeInOut"
                } : {
                  type: "spring",
                  stiffness: 260,
                  damping: 25
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ pointerEvents: isCenter ? "auto" : "none" }}
              >
                <div className="w-full max-w-2xl px-4 relative">
                  <CyberProjectCard project={project} isActive={isCenter} />
                  
                  {/* Shatter/Reconstruct Overlay */}
                  <AnimatePresence mode="wait">
                    {isCenter && direction > 0 && (
                      <ShardEffect key={`shatter-${currentIndex}`} mode="shatter" color="#EF4444" />
                    )}
                    {isCenter && direction < 0 && (
                      <ShardEffect key={`reconstruct-${currentIndex}`} mode="reconstruct" color="#10B981" />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Arcade Controller Navigation - Compact Pulsators for Mobile */}
      <div className="flex flex-row md:contents justify-center gap-6 mt-2 md:mt-0 px-4">
        <div className="md:absolute md:top-1/2 md:translate-y-1/2 md:left-[-110px] z-50">
          <motion.button
            onClick={handlePrev}
            className="relative w-24 h-12 md:w-28 md:h-28 rounded-xl md:rounded-full bg-[#10B981] border-b-[4px] md:border-b-[10px] border-[#065F46] shadow-[0_5px_15px_rgba(16,185,129,0.35)] flex items-center justify-center group"
            whileHover={{ y: 1, borderBottomWidth: isMobile ? "2px" : "8px" }}
            whileTap={{ y: 4, borderBottomWidth: "1px", scale: 0.95 }}
          >
            {/* Surface highlights */}
            <div className="hidden md:block absolute inset-3 rounded-full border-4 border-white/20 opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="hidden md:block absolute top-4 left-6 w-8 h-4 bg-white/20 rounded-full blur-[2px] rotate-[-20deg]" />
            <div className="absolute inset-0 rounded-xl md:rounded-full bg-gradient-to-tr from-[#065F46]/60 to-white/10 opacity-40" />
          </motion.button>
        </div>

        <div className="md:absolute md:top-1/2 md:translate-y-1/2 md:right-[-110px] z-50">
          <motion.button
            onClick={handleNext}
            className="relative w-24 h-12 md:w-28 md:h-28 rounded-xl md:rounded-full bg-[#EF4444] border-b-[4px] md:border-b-[10px] border-[#991B1B] shadow-[0_5px_15px_rgba(239,68,68,0.35)] flex items-center justify-center group"
            whileHover={{ y: 1, borderBottomWidth: isMobile ? "2px" : "8px" }}
            whileTap={{ y: 4, borderBottomWidth: "1px", scale: 0.95 }}
          >
            {/* Surface highlights */}
            <div className="hidden md:block absolute inset-3 rounded-full border-4 border-white/20 opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="hidden md:block absolute top-4 left-6 w-8 h-4 bg-white/20 rounded-full blur-[2px] rotate-[-20deg]" />
            <div className="absolute inset-0 rounded-xl md:rounded-full bg-gradient-to-tr from-[#991B1B]/60 to-white/10 opacity-40" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
