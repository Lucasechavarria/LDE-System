import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MatrixText } from './ui/MatrixText';
import { LiquidGlowButton } from './ui/LiquidGlowButton';
import { ProjectCarousel } from './ui/ProjectCarousel';

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  collaborative?: boolean;
  highlight?: boolean;
}

const projects: Project[] = [
  {
    title: 'VirtudGym',
    description: 'SaaS completo para gestión integral de gimnasios. Arquitectura multi-tenant con automatización de reservas y reportes técnicos.',
    tech: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'],
    github: 'https://github.com/Lucasechavarria/vitudgym',
    demo: 'https://virtudgym.vercel.app/',
    highlight: true,
  },
  {
    title: 'Congreso Logística 2026',
    description: 'Evolución técnica de la plataforma de la UNAB. Desarrollo integral basado en la arquitectura anterior con mejoras de rendimiento.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Framer Motion'],
    github: 'https://github.com/Lucasechavarria/Congreso-de-Logistica-de-la-UNAB-2026',
    demo: 'https://www.congresologistica.unab.edu.ar/',
    highlight: true,
  },
  {
    title: 'Congreso Logística 2025',
    description: 'Plataforma oficial de gestión para el congreso de la UNAB. Sistema colaborativo para acreditaciones y gestión de expositores.',
    tech: ['Django', 'Python', 'React', 'Bootstrap'],
    github: 'https://github.com/Lucasechavarria/Congreso-De-Logistica-UNAB',
    demo: 'https://congreso-unab.netlify.app/',
    collaborative: true,
  },
  {
    title: 'FamilIAgenda',
    description: 'Sistema inteligente de organización familiar con IA. Gestión de tareas y recordatorios con interfaz de última generación.',
    tech: ['React 19', 'Firebase', 'Gemini API', 'Vite'],
    github: 'https://github.com/Lucasechavarria/FamilIAgenda',
    demo: 'https://famil-ia-genda.vercel.app/login',
    highlight: true,
  },
  {
    title: 'Radio Go',
    description: 'Plataforma de streaming y gestión para radio online. Desarrollo colaborativo con enfoque en baja latencia y UX dinámica.',
    tech: ['JavaScript', 'Socket.io', 'Node.js', 'WebAudio'],
    github: 'https://github.com/Lucasechavarria/radio-go',
    demo: 'https://www.radiogo.com.ar/',
    collaborative: true,
  },
  {
    title: 'Torneo Long Hu He',
    description: 'Sistema de inscripciones para eventos de artes marciales. Automatización de categorías y gestión de competidores.',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma'],
    github: 'https://github.com/Lucasechavarria/torneo-long-hu-he',
    demo: 'https://torneo-long-hu-he.vercel.app/',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen py-24 bg-[#050505] relative overflow-hidden">
      {/* Background decoration consistent with other sections */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #00F0FF 1px, transparent 0)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-y-2 sm:gap-x-4">
            <MatrixText text="Proyectos" color="#FFFFFF" speed={0.1} triggerInView={true} className="text-3xl sm:text-4xl md:text-5xl" />
            <MatrixText text="Destacados" color="#00F0FF" speed={0.1} delay={600} triggerInView={true} className="text-3xl sm:text-4xl md:text-5xl" />
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00F0FF] to-[#FF0080] opacity-80 mx-auto sm:mx-0" />
        </motion.div>

        {/* New Carousel Implementation */}
        <div className="relative">
          <ProjectCarousel projects={projects} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <LiquidGlowButton
            onClick={() => window.open('https://github.com/Lucasechavarria', '_blank')}
            glowColor="#00F0FF"
            fillColor="#00F0FF"
          >
            Ver más en GitHub
          </LiquidGlowButton>
        </motion.div>
      </div>
    </section>
  );
}