"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface MatrixTextProps {
  text: string;
  speed?: number;
  color?: string;
  className?: string;
  delay?: number;
  triggerInView?: boolean;
}

const GLYPHS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ";

export const MatrixText = ({
  text,
  speed = 0.1,
  color = "#00FF41",
  className = "",
  delay = 0,
  triggerInView = false,
}: MatrixTextProps) => {
  const [displayText, setDisplayText] = useState<string[]>(text.split("").map(() => " "));
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (triggerInView) {
      if (isInView) {
        const timeout = setTimeout(() => setIsStarted(true), delay);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => setIsStarted(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, triggerInView, delay]);

  useEffect(() => {
    if (!isStarted) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text.split("").map((char, i) => {
          if (i < iteration) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [text, speed, isStarted]);

  return (
    <div 
      ref={containerRef}
      className={`font-mono font-bold tracking-widest inline-block ${className}`} 
      style={{ color }}
    >
      {displayText.map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          initial={{ opacity: 0, textShadow: `0 0 0px ${color}` }}
          animate={{ opacity: 1, textShadow: `0 0 8px ${color}` }}
          transition={{ duration: 0.1 }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default MatrixText;
