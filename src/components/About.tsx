import { motion } from 'framer-motion';
import HarmonicStrings from './HarmonicStrings';
import { MatrixText } from './ui/MatrixText';

export default function About() {
  const tags = ["Arquitectura de Sistemas", "SaaS", "Automatización", "IA", "Freelance"];

  return (
    <section id="about" className="min-h-screen py-24 bg-[#050505] relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #00F0FF 1px, transparent 0)`,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 md:mb-20 text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter flex flex-col sm:flex-row items-center lg:items-start lg:justify-start gap-y-2 sm:gap-x-2">
            <MatrixText text="Sobre" color="#FFFFFF" speed={0.1} triggerInView={true} className="text-3xl sm:text-4xl md:text-5xl" />
            <MatrixText text="Mí" color="#00F0FF" speed={0.1} delay={400} triggerInView={true} className="text-3xl sm:text-4xl md:text-5xl" />
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00F0FF] to-[#FF0080] opacity-80 mx-auto lg:mx-0" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Bio Content - Structured exactly like the requested image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-10 w-full max-w-[280px] sm:max-w-none mx-auto lg:mx-0"
          >
            <div className="space-y-4 md:space-y-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 font-light leading-relaxed text-center lg:text-left">
              <p>
                Ingeniero <span className="text-[#00F0FF] font-bold">Fullstack</span> enfocado en el diseño y desarrollo de <span className="text-[#00F0FF] font-bold">soluciones escalables</span>. Actualmente trabajo como freelancer, siempre abierto a nuevas oportunidades y desafíos tecnológicos. Además del desarrollo, me encuentro en formación docente para compartir el conocimiento técnico.
              </p>

              <p>
                Cuando no estoy programando o diseñando arquitecturas de bases de datos, dedico mi tiempo a entrenar <span className="text-[#00F0FF] font-bold">Kung Fu</span>, tocar el <span className="text-[#00F0FF] font-bold">Cello</span> o la <span className="text-[#00F0FF] font-bold">Guitarra</span>, y experimentar con nuevas ideas en la <span className="text-[#00F0FF] font-bold">Cocina</span>.
              </p>

              <p>
                Esta disciplina y pasión por la práctica perfecta se refleja en cada línea de código que escribo, buscando siempre la <span className="text-[#00F0FF] font-bold">elegancia</span> y la <span className="text-[#00F0FF] font-bold">eficiencia</span> en cada solución.
              </p>
            </div>

            {/* Tags - Pill styled based on original image */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-4 sm:pt-6">
              {tags.map((tag, idx) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 border border-[#00F0FF]/40 rounded-full text-[10px] sm:text-sm font-medium text-[#00F0FF] bg-[#00F0FF]/5 hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] transition-all duration-300 cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Cello Interaction (Easter Egg) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5 flex flex-col items-center pt-8"
          >
            <div className="relative group cursor-crosshair">
              {/* Subtle ambient glow behind the cello image */}
              <div className="absolute inset-0 bg-[#00F0FF]/10 blur-[120px] rounded-full pointer-events-none" />
              <HarmonicStrings />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}