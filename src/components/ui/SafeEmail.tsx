"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface SafeEmailProps {
  className?: string;
}

export const SafeEmail: React.FC<SafeEmailProps> = ({ className = "" }) => {
  const [email, setEmail] = useState('');
  
  // Scrambled parts to avoid simple scraping
  const user = "echavarrialucas1986";
  const domain = "gmail.com";

  useEffect(() => {
    // Assemble only on client side
    setEmail(`${user}@${domain}`);
  }, []);

  const handleCopy = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      // Optional: trigger a small visual feedback
    }
  };

  return (
    <motion.div 
      className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#121212] border border-[#374151]/50 hover:border-[#00F0FF]/50 transition-all cursor-pointer group ${className}`}
      onClick={handleCopy}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] shrink-0">
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      <span className="text-xs min-[360px]:text-sm sm:text-base font-mono text-gray-400 group-hover:text-[#E5E7EB] transition-colors truncate">
        {email || "••••••••••••••••••••"}
      </span>
      
      <div className="hidden min-[400px]:block text-[10px] sm:text-sm text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter whitespace-nowrap">
        Click para copiar
      </div>
    </motion.div>
  );
};
