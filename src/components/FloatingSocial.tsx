'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle } from 'lucide-react';

export const FloatingSocial = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleChatClick = () => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin?tab=chats');
      } else {
        router.push('/dashboard?tab=chat');
      }
    } else {
      router.push('/login?redirect=/dashboard?tab=chat');
    }
  };

  const chatTooltip = user?.role === 'admin' ? 'View Live Chats' : 'Live Chat with Nafij';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Real-Time Live Chat Floating Button */}
      <div className="relative group flex items-center justify-end">
        {/* Modern Slide-in Tooltip */}
        <span className="absolute right-16 bg-brand-card-dark/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-brand-border-white opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl translate-x-2 group-hover:translate-x-0">
          {chatTooltip}
        </span>

        {/* Pulsing Aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF007A] to-[#7928CA] opacity-35 pointer-events-none"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.7,
          }}
        />

        {/* Floating Button */}
        <motion.button
          onClick={handleChatClick}
          aria-label={chatTooltip}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -5, 0],
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { type: 'spring', stiffness: 260, damping: 20 },
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.88,
            }
          }}
          whileHover={{ 
            scale: 1.12, 
            rotate: 8,
            transition: { type: 'spring', stiffness: 400, damping: 12 }
          }}
          whileTap={{ scale: 0.94 }}
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#FF007A] to-[#7928CA] text-white rounded-full shadow-[0_0_20px_rgba(255,0,122,0.45)] border border-white/20 hover:shadow-[0_0_30px_rgba(255,0,122,0.7)] transition-shadow duration-300 cursor-pointer"
        >
          <MessageCircle className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5" />
        </motion.button>
      </div>

      {/* Facebook Floating Button */}
      <div className="relative group flex items-center justify-end">
        {/* Modern Slide-in Tooltip */}
        <span className="absolute right-16 bg-brand-card-dark/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-brand-border-white opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl translate-x-2 group-hover:translate-x-0">
          Connect on Facebook
        </span>

        {/* Pulsing Aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0062E6] to-[#33AEFF] opacity-35 pointer-events-none"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.4,
          }}
        />

        {/* Floating Button */}
        <motion.a
          href="https://www.facebook.com/nafijislam99/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect with Nafij on Facebook"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -5, 0],
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { type: 'spring', stiffness: 260, damping: 20 },
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.75,
            }
          }}
          whileHover={{ 
            scale: 1.12, 
            rotate: 8,
            transition: { type: 'spring', stiffness: 400, damping: 12 }
          }}
          whileTap={{ scale: 0.94 }}
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#0062E6] to-[#33AEFF] text-white rounded-full shadow-[0_0_20px_rgba(0,98,230,0.45)] border border-white/20 hover:shadow-[0_0_30px_rgba(0,98,230,0.7)] transition-shadow duration-300"
        >
          {/* Official Facebook SVG Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </motion.a>
      </div>

      {/* WhatsApp Floating Button */}
      <div className="relative group flex items-center justify-end">
        {/* Modern Slide-in Tooltip */}
        <span className="absolute right-16 bg-brand-card-dark/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-brand-border-white opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl translate-x-2 group-hover:translate-x-0">
          Chat on WhatsApp
        </span>

        {/* Pulsing Aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] opacity-35 pointer-events-none"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating Button */}
        <motion.a
          href="https://wa.me/8801633003462"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Nafij on WhatsApp"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -5, 0],
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { type: 'spring', stiffness: 260, damping: 20 },
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.25,
            }
          }}
          whileHover={{ 
            scale: 1.12, 
            rotate: -8,
            transition: { type: 'spring', stiffness: 400, damping: 12 }
          }}
          whileTap={{ scale: 0.94 }}
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.45)] border border-white/20 hover:shadow-[0_0_30px_rgba(37,211,102,0.7)] transition-shadow duration-300"
        >
          {/* Official WhatsApp SVG Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </motion.a>
      </div>
    </div>
  );
};

export default FloatingSocial;
