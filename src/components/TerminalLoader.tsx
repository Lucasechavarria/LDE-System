import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatrixRainBackground } from './ui/MatrixRainBackground';

interface TerminalLoaderProps {
  onComplete: () => void;
}

const terminalLines = [
  { text: '> System Check... OK', delay: 0 },
  { text: '> Loading Architecture... OK', delay: 800 },
  { text: '> Initializing LDE.dev Kernel...', delay: 1600 },
  { text: '> Mounting Components...', delay: 2400 },
  { text: '> Access Granted', delay: 3200 },
];

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
      setIsComplete(true);
    }, 4500);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    terminalLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, line.text]);
      }, line.delay);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black cursor-wait"
        >
          <MatrixRainBackground color="#00F0FF" speed={0.8} density={0.9}>
            <div className="w-full max-w-lg p-8 font-mono bg-black/40 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-6"
              >
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-[10px] uppercase tracking-widest text-[#00F0FF]/60">LDE.dev Terminal</span>
              </motion.div>

              <div className="space-y-3">
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[#00F0FF] text-xs">➜</span>
                    <span className="text-[#E5E7EB] text-sm md:text-base">{line}</span>
                    {index === lines.length - 1 && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-[#00F0FF]"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </MatrixRainBackground>
        </motion.div>
      )}
    </AnimatePresence>
  );
}