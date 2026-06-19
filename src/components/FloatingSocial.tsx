'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const FloatingSocial = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Facebook Messenger Floating Button */}
      <div className="relative group">
        {/* Pulsing Glow Aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#0084FF] opacity-30 pointer-events-none"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.25,
          }}
        />
        <motion.a
          href="https://www.facebook.com/nafijislam99/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Nafij on Facebook"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#0084FF] text-white rounded-full shadow-[0_0_15px_rgba(0,132,255,0.5)] border border-white/10 hover:shadow-[0_0_25px_rgba(0,132,255,0.8)] transition-all duration-300"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
          whileHover={{ scale: 1.12, rotate: 6 }}
          whileTap={{ scale: 0.94 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.28 177.94 8.35 7.42 13.75 17.66 12.36 28.59l-5.61 44.1c-1.76 13.81 11.23 24.3 24.15 19.38l50.28-19.14c9.85-3.75 20.67-3.11 30.14 1.8 18.6 9.59 39.34 14.76 61 14.76 140.03 0 248.55-102.34 248.55-240.57C505.1 110.34 396.58 8 256.55 8zm76.52 168.21l-50.62 80.79c-11.58 18.5-36.59 23.1-53.87 9.94l-39.69-30.27c-9.47-7.21-22.75-7.21-32.22 0l-55.27 42.11c-11.83 9.02-27.18-5.32-19.53-17.54l50.62-80.79c11.58-18.5 36.59-23.1 53.87-9.94l39.69 30.27c9.47 7.21 22.75 7.21 32.22 0l55.27-42.11c11.83-9.02 27.18 5.32 19.53 17.54z"/>
          </svg>
        </motion.a>
      </div>

      {/* WhatsApp Floating Button */}
      <div className="relative group">
        {/* Pulsing Glow Aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 pointer-events-none"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.a
          href="https://wa.me/8801633003462"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Nafij on WhatsApp"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-[0_0_15px_rgba(37,211,102,0.5)] border border-white/10 hover:shadow-[0_0_25px_rgba(37,211,102,0.8)] transition-all duration-300"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.12, rotate: -6 }}
          whileTap={{ scale: 0.94 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </motion.a>
      </div>
    </div>
  );
};

export default FloatingSocial;
