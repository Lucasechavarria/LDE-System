import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { MatrixText } from './ui/MatrixText';
import { LiquidGlowButton } from './ui/LiquidGlowButton';
import { SafeEmail } from './ui/SafeEmail';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonX = useMotionValue(0);
  const buttonY = useMotionValue(0);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = formData.name.trim().length > 0 && 
                  emailRegex.test(formData.email) && 
                  formData.message.trim().length > 0;
    setIsValid(valid);
    
    // Clear errors when user types
    if (errors.length > 0) setErrors([]);
  }, [formData]);

  const validate = () => {
    const newErrors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.push("- Tu nombre es necesario para la arquitectura del mensaje.");
    if (!formData.email.trim()) {
      newErrors.push("- Tu email es requerido para establecer la conexión.");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.push("- El formato del email no es válido.");
    }
    if (!formData.message.trim()) newErrors.push("- El cuerpo del mensaje no puede estar vacío.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only dodge if it's invalid AND we haven't dodged too much
    if (!isValid && buttonRef.current && dodgeCount < 2) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const dx = mouseX - buttonCenterX;
      const dy = mouseY - buttonCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const angle = Math.atan2(dy, dx);
        const dodgeX = Math.cos(angle + Math.PI) * 160;
        const dodgeY = Math.sin(angle + Math.PI) * 100;

        buttonX.set(dodgeX);
        buttonY.set(dodgeY);

        setDodgeCount(prev => prev + 1);

        setTimeout(() => {
          buttonX.set(0);
          buttonY.set(0);
        }, 500);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      
      // Functional Direct Email Connection (mailto)
      const subject = encodeURIComponent(`Nuevo mensaje de portafolio LDE-System - ${formData.name}`);
      const body = encodeURIComponent(`Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`);
      
      // Delay to show the success state before opening mail client
      setTimeout(() => {
        window.location.href = `mailto:echavarrialucas1986@gmail.com?subject=${subject}&body=${body}`;
        
        // Reset form
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitted(false);
        setErrors([]);
        setDodgeCount(0);
      }, 1500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="min-h-screen py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E5E7EB] mb-4 uppercase tracking-tighter italic">
            <MatrixText text="Contacto" color="#E5E7EB" speed={0.1} triggerInView={true} className="text-3xl sm:text-4xl md:text-5xl" />
          </h2>
          <div className="text-sm sm:text-base md:text-xl lg:text-2xl text-[#9CA3AF] flex flex-col sm:flex-row items-center justify-center gap-y-1 sm:gap-x-2">
            <MatrixText text="¿Tienes un proyecto en mente?" color="#9CA3AF" speed={0.05} delay={400} triggerInView={true} className="text-sm sm:text-base md:text-xl" />
            <MatrixText text="Hablemos." color="#00F0FF" speed={0.05} delay={1200} triggerInView={true} className="text-sm sm:text-base md:text-xl" />
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00F0FF] to-[#FF2E63] rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-8 relative">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm md:text-base lg:text-lg font-medium text-[#9CA3AF] mb-2 sm:mb-3 ml-1 uppercase tracking-widest text-[10px] sm:text-xs">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 sm:px-6 sm:py-5 bg-[#121212]/50 border border-[#374151] rounded-2xl text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#00F0FF] transition-all font-sans text-base sm:text-lg"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm md:text-base lg:text-lg font-medium text-[#9CA3AF] mb-2 sm:mb-3 ml-1 uppercase tracking-widest text-[10px] sm:text-xs">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 sm:px-6 sm:py-5 bg-[#121212]/50 border border-[#374151] rounded-2xl text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#00F0FF] transition-all font-sans text-base sm:text-lg"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm md:text-base lg:text-lg font-medium text-[#9CA3AF] mb-2 sm:mb-3 ml-1 uppercase tracking-widest text-[10px] sm:text-xs">Mensaje</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3.5 sm:px-6 sm:py-5 bg-[#121212]/50 border border-[#374151] rounded-2xl text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#00F0FF] transition-all font-sans text-base sm:text-lg resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                />
              </div>

              {/* Error Box */}
              <AnimatePresence>
                {errors.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-2xl bg-[#FF2E63]/10 border border-[#FF2E63]/20 text-[#FF2E63] text-sm font-mono space-y-1"
                  >
                    {errors.map((err, i) => <div key={i}>{err}</div>)}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center pt-6">
                <motion.div
                  animate={{ x: buttonX, y: buttonY }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <LiquidGlowButton
                    ref={buttonRef}
                    type="submit"
                    onMouseMove={handleMouseMove}
                    glowColor="#00F0FF"
                    fillColor="#00F0FF"
                    textColor="#050505"
                    className="px-6 py-3 sm:px-16 sm:py-5 text-base sm:text-lg md:text-xl font-black uppercase tracking-widest"
                  >
                    ENVIAR MENSAJE
                  </LiquidGlowButton>
                </motion.div>
              </div>

              {/* Success Overlay */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]/90 rounded-3xl border border-[#00F0FF]/30"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center space-y-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-[#00F0FF]/10 flex items-center justify-center mx-auto border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                        <motion.span 
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="text-[#00F0FF] text-3xl"
                        >
                          ✓
                        </motion.span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-[#00F0FF] font-black uppercase tracking-[0.3em] text-2xl italic">Transmisión Exitosa</h3>
                        <p className="text-gray-400 font-mono text-sm max-w-xs mx-auto">Datos encriptados y enviados a la central de arquitectura.</p>
                      </div>
                      <div className="w-48 h-1.5 bg-[#00F0FF]/20 mx-auto rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#00F0FF] shadow-[0_0_15px_#00F0FF]"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 3.5, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Social Icons & Bottom Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20 space-y-16"
          >
            {/* Social Links Original Style */}
            <div className="flex justify-center gap-8">
              <a
                href="https://github.com/Lucasechavarria"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-[#121212] border border-[#374151] text-[#9CA3AF] hover:text-[#00F0FF] hover:border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-[#121212] border border-[#374151] text-[#9CA3AF] hover:text-[#00F0FF] hover:border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a
                href="mailto:echavarrialucas1986@gmail.com"
                className="p-4 rounded-full bg-[#121212] border border-[#374151] text-[#9CA3AF] hover:text-[#00F0FF] hover:border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>

            {/* Technical Footer Info - Spaced & Focused Layout */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-x-12 lg:gap-x-20 pt-10 border-t border-white/5 w-full">
              {/* Connection Node */}
              <div className="flex flex-col items-center md:items-start space-y-3 shrink-0 w-full md:w-auto">
                <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">Conexión Directa</h4>
                <SafeEmail className="w-full justify-between" />
              </div>

              {/* CV Download Slot - Clean Width */}
              <motion.a
                href="/ECHAVARRIA.cv.pdf"
                download
                className="flex items-center gap-4 px-4 py-3 sm:px-7 sm:py-5 rounded-2xl bg-[#121212] border border-[#00F0FF]/20 hover:border-[#00F0FF]/60 transition-all group relative overflow-hidden shrink-0 w-full sm:min-w-[240px] sm:w-auto"
                whileHover={{ y: -8, shadow: "0 0 30px rgba(0,240,255,0.15)" }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00F0FF]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#00F0FF]/5 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/20 group-hover:border-[#00F0FF]/40 transition-all">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-[#E5E7EB] group-hover:text-white transition-colors">Descargar CV</span>
                  <span className="text-[8px] sm:text-[9px] font-mono text-[#00F0FF]/60 font-bold tracking-tighter italic whitespace-nowrap">ECHAVARRIA.cv.pdf</span>
                </div>
              </motion.a>

              {/* Status Box - Compact & Solid */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#121212]/30 border border-white/5 shrink-0 w-full sm:min-w-[240px] sm:w-auto">
                <p className="text-sm font-mono leading-relaxed tracking-tighter flex flex-col gap-1.5 sm:gap-2">
                  <span className="flex justify-between items-center gap-8">
                    <span className="text-gray-500 uppercase text-[9px] font-black tracking-widest">Status</span>
                    <span className="text-[#00F0FF] font-bold text-xs">ONLINE</span>
                  </span>
                  <span className="flex justify-between items-center gap-8">
                    <span className="text-gray-500 uppercase text-[9px] font-black tracking-widest">Location</span>
                    <span className="text-white text-xs whitespace-nowrap">ARG / REMOTE</span>
                  </span>
                  <span className="flex justify-between items-center gap-8">
                    <span className="text-gray-500 uppercase text-[9px] font-black tracking-widest">Encryption</span>
                    <span className="text-[#00F0FF] text-xs font-bold">ACTIVE</span>
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}