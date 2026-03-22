import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatrixText } from './ui/MatrixText';
import { LiquidGlowButton } from './ui/LiquidGlowButton';

interface FloatingBlock {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  color: string;
  logo: string;
  isHit?: boolean;
}

const techStack = [
  { label: 'React', color: '#61DAFB', logo: 'https://cdn.simpleicons.org/react/61DAFB' },
  { label: 'Next.js', color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/nextdotjs/white' },
  { label: 'Django', color: '#092E20', logo: 'https://cdn.simpleicons.org/django/white' }, // Changed to white for visibility
  { label: 'Supabase', color: '#3FCF8E', logo: 'https://cdn.simpleicons.org/supabase/3FCF8E' },
  { label: 'n8n', color: '#FF6B6B', logo: 'https://cdn.simpleicons.org/n8n/FF6B6B' },
  { label: 'TypeScript', color: '#3178C6', logo: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { label: 'Python', color: '#3776AB', logo: 'https://cdn.simpleicons.org/python/3776AB' },
  { label: 'PostgreSQL', color: '#336791', logo: 'https://cdn.simpleicons.org/postgresql/336791' },
  { label: 'FastAPI', color: '#05998B', logo: 'https://cdn.simpleicons.org/fastapi/05998B' },
  { label: 'Celery', color: '#37814A', logo: 'https://cdn.simpleicons.org/celery/37814A' },
  { label: 'Redis', color: '#DC382D', logo: 'https://cdn.simpleicons.org/redis/DC382D' },
  { label: 'NestJS', color: '#E0234E', logo: 'https://cdn.simpleicons.org/nestjs/E0234E' },
  { label: 'Redux', color: '#764ABC', logo: 'https://cdn.simpleicons.org/redux/764ABC' },
  { label: 'Docker', color: '#2496ED', logo: 'https://cdn.simpleicons.org/docker/2496ED' },
  { label: 'GraphQL', color: '#E10098', logo: 'https://cdn.simpleicons.org/graphql/E10098' },
  { label: 'Shadcn UI', color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/shadcnui/white' },
  { label: 'Framer', color: '#0055FF', logo: 'https://cdn.simpleicons.org/framer/0055FF' },
  { label: 'Prisma', color: '#2D3748', logo: 'https://cdn.simpleicons.org/prisma/white' },
  { label: 'Drizzle', color: '#C5F74F', logo: 'https://cdn.simpleicons.org/drizzle/C5F74F' },
];

export default function KungFuHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<FloatingBlock[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
  const [isPunching, setIsPunching] = useState(false);
  const velocityRef = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const blocksCount = isMobile ? 10 : techStack.length;
    const shuffledStack = [...techStack].sort(() => Math.random() - 0.5);
    
    const initialBlocks: FloatingBlock[] = shuffledStack.slice(0, blocksCount).map((tech, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: Math.random() * (window.innerHeight - 300) + 150,
      vx: (Math.random() - 0.5) * (isMobile ? 1 : 1.5),
      vy: (Math.random() - 0.5) * (isMobile ? 1 : 1.5),
      label: tech.label,
      color: tech.color,
      logo: tech.logo,
    }));
    setBlocks(initialBlocks);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only process if mouse is inside the hero section
      const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      if (isInside) {
        const dx = x - prevMousePos.x;
        const dy = y - prevMousePos.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        velocityRef.current = velocity;

        setPrevMousePos({ x, y });
        setMousePos({ x, y });

        if (velocity > 8) {
          setIsPunching(true);
          setTimeout(() => setIsPunching(false), 200);

          setBlocks(prev => prev.map(block => {
            const bDx = block.x + 40 - x;
            const bDy = block.y + 40 - y;
            const dist = Math.sqrt(bDx * bDx + bDy * bDy);

            if (dist < 110) {
              const force = (110 - dist) / 110;
              const angle = Math.atan2(bDy, bDx);
              const pushX = Math.cos(angle) * force * velocity * 0.8;
              const pushY = Math.sin(angle) * force * velocity * 0.8;

              return {
                ...block,
                vx: block.vx + pushX,
                vy: block.vy + pushY,
                isHit: true
              };
            }
            return { ...block, isHit: false };
          }));
        }
      } else {
        // Reset or hide glove if needed by setting mousePos to far away
        setMousePos({ x: -100, y: -100 });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mousePos, prevMousePos]);

  useEffect(() => {
    const animateBlocks = () => {
      setBlocks(prev => prev.map(block => {
        let newX = block.x + block.vx;
        let newY = block.y + block.vy;
        let newVx = block.vx * 0.98; // Friction
        let newVy = block.vy * 0.98;

        // Wall collisions
        if (newX < 0 || newX > window.innerWidth - 100) {
          newVx = -newVx * 0.8;
          newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
        }
        if (newY < 0 || newY > window.innerHeight - 100) {
          newVy = -newVy * 0.8;
          newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
        }

        return {
          ...block,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          isHit: false // Reset hit state
        };
      }));

      animationRef.current = requestAnimationFrame(animateBlocks);
    };

    animationRef.current = requestAnimationFrame(animateBlocks);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505] cursor-none"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Blocks */}
      {blocks.map((block) => (
        <motion.div
          key={block.id}
          animate={{
            x: block.x,
            y: block.y,
            scale: block.isHit ? 1.2 : 1,
            rotate: block.vx * 2,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute z-20"
          style={{ left: 0, top: 0 }}
        >
          <div
            className="group relative w-12 h-12 md:w-20 md:h-20 flex flex-col items-center justify-center rounded-xl md:rounded-2xl backdrop-blur-md transition-all duration-300"
            style={{
              backgroundColor: 'rgba(18, 18, 18, 0.8)',
              border: `1px solid ${block.color}40`,
              boxShadow: block.isHit ? `0 0 30px ${block.color}` : `0 0 15px ${block.color}20`,
            }}
          >
            <img src={block.logo} alt={block.label} className="w-8 h-8 md:w-10 md:h-10 object-contain mb-1" />
            <span
              className="text-[8px] md:text-[10px] font-bold uppercase tracking-tighter"
              style={{ color: block.color }}
            >
              {block.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Boxing Glove Cursor */}
      <AnimatePresence>
        {mousePos.x > 0 && mousePos.y > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isPunching ? 1.4 : 1,
              x: mousePos.x - 20,
              y: mousePos.y - 20,
              rotate: isPunching ? [-10, 20, -10] : 0,
            }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute pointer-events-none z-50 text-4xl"
            transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.5 }}
          >
            <span role="img" aria-label="boxing glove" className="drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
              🥊
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter italic select-none flex flex-col items-center">
            <MatrixText text="Lucas Daniel" color="#FFFFFF" speed={0.08} delay={5500} className="text-4xl sm:text-6xl md:text-8xl" />
            <MatrixText text="Echavarria" color="#00F0FF" speed={0.08} delay={6500} className="text-4xl sm:text-6xl md:text-8xl" />
          </h1>

          <div className="text-base sm:text-xl md:text-2xl text-gray-400 mb-12 font-light select-none flex flex-col sm:flex-row items-center justify-center gap-y-1 sm:gap-x-2">
            <MatrixText text="Fullstack Engineer |" color="#9CA3AF" speed={0.06} delay={8000} className="text-base sm:text-xl md:text-2xl" />
            <MatrixText text="Arquitectura de Sistemas" color="#00F0FF" speed={0.06} delay={9000} className="text-base sm:text-xl md:text-2xl" />
          </div>

          <LiquidGlowButton
            onClick={() => handleScrollToSection('contact')}
            glowColor="#00F0FF"
            fillColor="#00F0FF"
            className="mt-4"
          >
            ¡Hablemos de Proyectos!
          </LiquidGlowButton>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 text-[10px] text-[#00F0FF]/40 uppercase tracking-[0.3em] font-mono select-none">
        Mueve el guante para entrenar tu stack
      </div>
    </section>
  );
}