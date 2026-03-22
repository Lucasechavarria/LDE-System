import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const Logo = ({ className = "", size = 40, glow = true }: LogoProps) => {
  return (
    <motion.div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Outer Glow Effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 bg-[#00F0FF]/20 blur-lg rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full"
      >
        {/* Diamond Shield Frame */}
        <motion.path
          d="M50 5 L92 50 L50 95 L8 50 Z"
          stroke="#00F0FF"
          strokeWidth="3.5"
          strokeOpacity="0.5"
          strokeLinejoin="miter"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Interior Monogram L-D-E */}
        <g stroke="#00F0FF" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter">
          {/* L */}
          <motion.path
            d="M32 38 V62 H42"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          />
          {/* D (Sharp Geometric) */}
          <motion.path
            d="M48 38 V62 L58 62 L63 50 L58 38 Z"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
          {/* E (Minimalist detail) */}
          <motion.path
            d="M68 42 H72 M68 50 H75 M68 58 H72"
            strokeWidth="3"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          />
        </g>

        {/* Technical Decor (Small corner accents) */}
        <path d="M50 15 L55 20 M50 85 L45 80" stroke="#00F0FF" strokeWidth="2" strokeOpacity="0.4" />
      </svg>
    </motion.div>
  );
};
