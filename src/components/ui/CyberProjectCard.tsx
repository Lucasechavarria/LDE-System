"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  collaborative?: boolean;
  highlight?: boolean;
}

export interface CyberProjectCardProps {
  project: Project;
  isActive?: boolean;
  className?: string;
}

export const CyberProjectCard: React.FC<CyberProjectCardProps> = ({
  project,
  isActive = false,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  const color = "#00F0FF"; // Theme Cyan
  const intensity = 1.5;

  // 3D Tilt calculation (Magnetic/Holographic feel)
  const rotateX = isHovered ? (mousePos.y - 0.5) * -25 * intensity : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 25 * intensity : 0;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ 
        rotateX, 
        rotateY, 
        scale: isHovered ? 1.05 : 1,
        z: isHovered ? 50 : 0
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      className={`relative w-full h-[380px] sm:h-[450px] rounded-3xl cursor-pointer group flex flex-col ${className}`}
    >
      {/* 1. GLASS BASE */}
      <div className="absolute inset-0 rounded-3xl bg-[#050505]/40 backdrop-blur-xl border border-white/10 overflow-hidden" />

      {/* 2. NEON GLOWS (Static & Hover) */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${color}22, 0 0 40px ${color}11`,
        }}
      />

      {/* 3. HOLOGRAPHIC RAINBOW LAYER */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              ${color}33,
              rgba(255, 0, 240, 0.1),
              rgba(0, 255, 240, 0.1),
              transparent 70%
            )
          `,
          opacity: isHovered ? 0.6 : 0,
          mixBlendMode: "screen",
        }}
      />

      {/* 4. SCANLINES (Cyberpunk feel) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden rounded-3xl"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 4px"
        }}
      />

      {/* 5. NEON CORNER ACCENTS */}
      {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-6 h-6 ${pos} opacity-40 group-hover:opacity-100 transition-opacity`}
          style={{
            borderTop: i < 2 ? `2px solid ${color}` : "none",
            borderBottom: i >= 2 ? `2px solid ${color}` : "none",
            borderLeft: i % 2 === 0 ? `2px solid ${color}` : "none",
            borderRight: i % 2 === 1 ? `2px solid ${color}` : "none",
          }}
          animate={isHovered ? { opacity: [0.4, 1, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      ))}

      {/* 6. CONTENT */}
      <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-between" style={{ transform: "translateZ(60px)" }}>
        <div>
          <div className="flex items-center justify-between mb-3 translate-y-[3px]">
            <motion.div 
              className="px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest"
              animate={isHovered ? { boxShadow: `0 0 15px ${color}44` } : {}}
            >
              LDE PROJECT ARCH
            </motion.div>
            {project.highlight && (
              <span className="text-[#FF2E63] text-[10px] font-black uppercase tracking-widest [text-shadow:0_0_10px_#FF2E63]">
                Highlight
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4 uppercase tracking-tighter leading-none italic flex flex-col">
            {project.title}
            {project.collaborative && (
              <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-2 not-italic">(COLABORATIVO)</span>
            )}
          </h3>
          
          <p className="text-gray-400 text-sm sm:text-lg md:text-xl font-light leading-relaxed max-w-md">
            {project.description}
          </p>
        </div>

        <div className="space-y-3 sm:space-y-5">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-mono font-bold border border-white/10 text-white/40 group-hover:text-[#00F0FF] group-hover:border-[#00F0FF]/30 transition-colors uppercase"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-row flex-nowrap justify-between items-center w-full gap-2 mt-4 sm:mt-0 translate-y-[-3px]">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white font-bold uppercase tracking-wider group/link transition-colors whitespace-nowrap"
              whileHover={{ x: 3 }}
            >
              <span className="text-[10px] sm:text-[11px]">Repositorio</span>
              <span className="text-[#00F0FF] italic text-[12px]">→</span>
            </motion.a>

            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#00F0FF] font-bold uppercase tracking-wider group/demo transition-all whitespace-nowrap text-right"
                whileHover={{ x: 3 }}
              >
                <div className="flex flex-col items-end">
                   <span className="text-[10px] sm:text-[11px]">Live Deploy</span>
                </div>
                <span className="italic text-[12px]">→</span>
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* 7. INNER PARTICLES (Floating Dots) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() 
            }}
            animate={{ 
              y: ["-20px", "20px", "-20px"],
              x: ["-10px", "10px", "-10px"],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
