"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface LiquidGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  baseColor?: string;
  glowColor?: string;
  fillColor?: string;
  textColor?: string;
  speed?: number;
}

export const LiquidGlowButton = React.forwardRef<HTMLButtonElement, LiquidGlowButtonProps>(({
  children,
  baseColor = "#050505",
  glowColor = "#00F0FF",
  fillColor = "#00F0FF",
  textColor = "#050505",
  speed = 0.4,
  className = "",
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
      className={`relative px-10 py-4 rounded-lg font-bold text-lg overflow-hidden transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: baseColor,
        color: isHovered && !props.disabled ? textColor : "#E5E7EB",
        ...props.style
      }}
    >
      {/* 1. ANIMATED BORDER GLOW */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          padding: '2px',
          background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor}, transparent, ${glowColor})`,
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div 
          className="w-full h-full rounded-lg" 
          style={{ backgroundColor: baseColor }}
        />
      </motion.div>

      {/* 2. LIQUID FILL EFFECT */}
      <motion.div
        className="absolute inset-[2px] rounded-lg z-0"
        style={{ backgroundColor: fillColor }}
        initial={{ y: '100%', borderRadius: '50% 50% 0 0' }}
        animate={{ 
          y: isHovered ? '0%' : '100%',
          borderRadius: isHovered ? '0%' : '50% 50% 0 0'
        }}
        transition={{ 
          duration: speed, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      />

      {/* 3. BUTTON TEXT */}
      <span className="relative z-10 block pointer-events-none">
        {children}
      </span>

      {/* Subtle outer glow on hover */}
      <div 
        className={`absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />
    </button>
  );
});

export default LiquidGlowButton;
