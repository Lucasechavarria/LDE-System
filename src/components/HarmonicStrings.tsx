import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const celloWorks = [
  { name: "Elgar - Cello Concerto", note: "C", color: "#00F0FF" },
  { name: "Bach - Cello Suite No. 1", note: "G", color: "#00F0FF" },
  { name: "Dvořák - Cello Concerto", note: "D", color: "#00F0FF" },
  { name: "Saint-Saëns - The Swan", note: "A", color: "#00F0FF" },
];

export default function HarmonicStrings() {
  const [activeString, setActiveString] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playCelloTone = (index: number) => {
    initAudio();
    const ctx = audioContextRef.current!;
    const now = ctx.currentTime;

    // Classical Themes: Elgar, Bach, Dvořák, Saint-Saëns
    const melodies = [
      // 0: Elgar - Cello Concerto (C String: C-G-E-C)
      [ { f: 65.41, d: 0.8 }, { f: 98.00, d: 0.8 }, { f: 82.41, d: 0.8 }, { f: 65.41, d: 1.2 } ],
      // 1: Bach - Suite No. 1 (G String: G-D-B-A-B-D-G)
      [ { f: 98.00, d: 0.25 }, { f: 146.83, d: 0.25 }, { f: 246.94, d: 0.25 }, { f: 220.00, d: 0.25 }, { f: 246.94, d: 0.25 }, { f: 146.83, d: 0.25 }, { f: 98.00, d: 0.5 } ],
      // 2: Dvořák - Cello Concerto (D String: D-A-F#-D)
      [ { f: 146.83, d: 0.6 }, { f: 220.00, d: 0.6 }, { f: 185.00, d: 0.6 }, { f: 146.83, d: 1.0 } ],
      // 3: Saint-Saëns - The Swan (A String: A-B-C#-D)
      [ { f: 220.00, d: 0.5 }, { f: 246.94, d: 0.5 }, { f: 277.18, d: 0.5 }, { f: 293.66, d: 1.0 } ]
    ];

    const sequence = melodies[index] || [];
    let timeOffset = 0;

    sequence.forEach((note) => {
      const startTime = now + timeOffset;
      const duration = note.d;
      const endTime = startTime + duration;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);
      filter.Q.setValueAtTime(2, startTime);

      const harmonics = [1, 2, 3, 4, 5];
      harmonics.forEach((h, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(note.f * h, startTime);
        
        const hG = ctx.createGain();
        hG.gain.value = [0.4, 0.2, 0.1, 0.05, 0.02][i];
        
        osc.connect(hG);
        hG.connect(gainNode);
        osc.start(startTime);
        osc.stop(endTime);
      });

      gainNode.connect(filter);
      filter.connect(ctx.destination);
      
      timeOffset += duration * 0.95; // Smooth legato overlap
    });
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={`relative w-[240px] sm:w-[340px] h-[400px] sm:h-[585px] flex items-center justify-center select-none group/cello ${isMobile ? 'scale-125' : 'scale-125 md:scale-150'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveString(null);
      }}
    >
      {/* EXTREME MACRO VIEW (3.2x ZOOM) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[40px] border border-white/5 shadow-2xl bg-black">
        <motion.div
          animate={{
            scale: isHovered ? (isMobile ? 3.4 : 4.5) : 1,
            y: isHovered ? (isMobile ? 140 : 200) : 0,
            opacity: isHovered ? 1 : 0.7
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full relative"
        >
          <img
            src="/assets/cello_body.png"
            alt="Macro Cello"
            className="w-full h-full object-contain filter contrast-[1.2] brightness-[0.8]"
          />
          {/* Reactive Ambient Bloom onto Wood */}
          <AnimatePresence>
            {activeString !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-cyan-500/20 mix-blend-color-dodge blur-[100px]"
                style={{
                   left: `${(activeString * 25) + 25}%`,
                   width: '50%'
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* PRECISION STRINGS - CURVED AND NEON LIGHT EFFECTS */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`relative flex justify-center gap-[12px] sm:gap-[18px] w-[120px] sm:w-[150px] h-[95%] z-30 pointer-events-none ${isMobile ? 'translate-y-[-60px]' : 'translate-y-[-80px]'}`}
          >
            {celloWorks.map((work, index) => {
              const rotations = isMobile ? [-0.8, -0.2, 0.2, 0.8] : [-1.1, -0.4, 0.4, 1.1];
              const inwardOffsets = isMobile ? [8, 2, 0, -6] : [12, 4, 0, -8];

              // 1. Mobile Config (320x490px)
              const mStartX = index === 3 ? 23 : 20;
              let mEndOffset = inwardOffsets[index];
              if (index === 3) mEndOffset -= 15;
              if (index === 1) mEndOffset += 9;
              if (index === 0) mEndOffset += 18;

              // 2. Desktop Config (PC)
              let dStartX = 20;
              let dEndOffset = 0;

              if (index === 0) { // String C: Final-tuned +0.5mm Top (+1.5), -0.5mm Bottom (-1.5)
                dStartX = -10; 
                dEndOffset = -4.5; 
              } else if (index === 1) { // String G: Final-tuned +0.5mm Top (+1.5), -0.25mm Bottom (-0.75)
                dStartX = 14.75; 
                dEndOffset = 0; 
              } else if (index === 2) { // String D: Fine-tuned -0.5mm Bottom (-1.5), -1mm Top (-3)
                dStartX = 39.5; 
                dEndOffset = 9; 
              } else if (index === 3) { // String A: Corrected +15px Right (to 59)
                dStartX = 59; 
                dEndOffset = 9; 
              }
 
              // Final values based on device
              const startX = isMobile ? mStartX : dStartX;
              const endOffset = isMobile ? mEndOffset : dEndOffset;
 
              const yBottom = isMobile ? 548 : 5834; 
              const yTop = isMobile ? 52 : 520; 
              const qY = isMobile ? 300 : 3177;
              
              // Dynamic Hitbox Alignment for Desktop (PC)
              // Centered internally (qX=20) and shifted externally (hShift) to follow visual
              const visualCenter = (startX + (20 + endOffset)) / 2;
              const hShift = isMobile ? 0 : (visualCenter - 20);
              const cSX = startX - hShift;
              const yB = yBottom || 0;
              const qx = isMobile ? 20 : (cSX + (20 + (endOffset - hShift))) / 2;
              const qy = qY || 0;
              const cEO = 20 + (endOffset - hShift);
              const yT = yTop || 0;

              return (
                <div
                  key={index}
                  className="relative h-[calc(100%-20px)] w-8 sm:w-10 mt-[20px] pointer-events-auto cursor-crosshair group/string"
                  style={{ transform: `rotate(${rotations[index] || 0}deg) translateX(${hShift}px)` }}
                  onMouseEnter={() => {
                    setActiveString(index);
                    playCelloTone(index);
                  }}
                  onMouseLeave={() => setActiveString(null)}
                >
                  <div className="absolute inset-x-0 top-0 bottom-0 z-10" />

                  {/* NEON BLOOM SVG LIGHT EFFECT */}
                  <svg
                    viewBox={`0 0 40 ${yB}`}
                    className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <filter id={`bloom-${index}`}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur6" />
                        <feMerge>
                          <feMergeNode in="blur2" />
                          <feMergeNode in="blur6" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Outer Ambient Glow (Secondary) */}
                    {activeString === index && (
                      <motion.path
                        d={`M ${cSX} ${yB} Q ${qx} ${qy} ${cEO} ${yT}`}
                        fill="none"
                        stroke="rgba(0, 240, 255, 0.4)"
                        strokeWidth="22"
                        animate={{
                          opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                      />
                    )}

                    {/* Main String Path */}
                    <motion.path
                      d={`M ${cSX} ${yB} Q ${qx} ${qy} ${cEO} ${yT}`}
                      fill="none"
                      stroke={activeString === index ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"}
                      strokeWidth={activeString === index ? 7.0 : 2.0}
                      animate={activeString === index ? {
                        d: [
                          `M ${cSX} ${yB} Q ${qx} ${qy} ${cEO} ${yT}`,
                          `M ${cSX} ${yB} Q ${qx - 25} ${qy} ${cEO} ${yT}`,
                          `M ${cSX} ${yB} Q ${qx + 25} ${qy} ${cEO} ${yT}`,
                          `M ${cSX} ${yB} Q ${qx} ${qy} ${cEO} ${yT}`,
                        ],
                        stroke: ["rgba(255,255,255,0.5)", "rgba(0, 240, 255, 0.35)", "rgba(255,255,255,0.5)"]
                      } : {
                        d: `M ${cSX} ${yB} Q ${qx} ${qy} ${cEO} ${yT}`,
                        stroke: "rgba(255,255,255,0.1)"
                      }}
                      transition={{
                        duration: 0.04,
                        repeat: activeString === index ? Infinity : 0,
                        ease: "linear"
                      }}
                      style={{
                        filter: activeString === index ? `url(#bloom-${index})` : 'none',
                      }}
                    />
                  </svg>

                  {/* High-End Tooltip - Responsivo y centrado en móvil */}
                  <AnimatePresence>
                    {activeString === index && (
                      <motion.div
                        initial={{ opacity: 0, y: isMobile ? 50 : -50, scale: 0.8, x: isMobile ? "-50%" : -50 }}
                        animate={{ opacity: 1, y: isMobile ? 150 : -50, scale: 1, x: isMobile ? "-50%" : -280 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute top-1/2 z-50 pointer-events-none ${isMobile ? 'left-1/2' : 'left-0'}`}
                      >
                        <div className="bg-[#050505]/98 backdrop-blur-3xl border border-[#00F0FF]/30 p-2 sm:p-5 min-w-[180px] sm:min-w-[260px] rounded-lg shadow-[0_40px_100px_rgba(0,0,0,1)] border-l-4 border-l-[#00F0FF]">
                          <h4 className="text-xs sm:text-xl text-white font-serif italic mb-1 tracking-tighter leading-tight">{work.name}</h4>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00F0FF] to-transparent" />
                            <p className="text-[#00F0FF] text-[7px] sm:text-[9px] uppercase font-black tracking-widest">RESONANCE</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {!isHovered && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] border border-white/5 rounded-[40px] pointer-events-none transition-all duration-700 opacity-100 group-hover/cello:opacity-0 group-hover/cello:translate-y-10">
          <p className="text-[#00F0FF] text-[10px] sm:text-[10px] uppercase tracking-[0.5em] sm:tracking-[1.2em] font-black opacity-60 mb-3 px-4 sm:px-8 text-center">Precise Resonance</p>
          <div className="w-8 sm:w-12 h-[1px] bg-[#00F0FF]/30 animate-pulse" />
        </div>
      )}
    </div>
  );
}