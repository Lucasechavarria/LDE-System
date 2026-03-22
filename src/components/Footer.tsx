import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-8 bg-[#050505] border-t border-[#374151]/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="text-[#9CA3AF] text-sm">
            © {new Date().getFullYear()} <span className="text-[#00F0FF]">LDE-System</span>. Todos los derechos reservados.
          </div>

        </motion.div>
      </div>
    </footer>
  );
}