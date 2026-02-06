import React, { useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FloatingLogoProps {
  onTriggerVibrant?: () => void;
}

export const FloatingLogo: React.FC<FloatingLogoProps> = ({ onTriggerVibrant }) => {
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controls = useAnimation();

  const startPress = () => {
    setIsPressing(true);
    // Animate "charging"
    controls.start({
      scale: 0.9,
      filter: "brightness(1.5)",
      transition: { duration: 2 }
    });

    // Set timer for 2 seconds (Long Press)
    timerRef.current = setTimeout(() => {
      if (onTriggerVibrant) {
        onTriggerVibrant();
        // Feedback animation for success
        controls.start({
          scale: [0.9, 1.1, 1],
          filter: ["brightness(2)", "brightness(1)"],
          transition: { duration: 0.3 }
        });
      }
      setIsPressing(false);
    }, 2000);
  };

  const endPress = () => {
    setIsPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Reset animation if released too early
    controls.start({
      scale: 1,
      filter: "brightness(1)",
      transition: { duration: 0.3 }
    });
  };

  return (
    <motion.div 
      className="relative flex items-center justify-center cursor-pointer select-none -webkit-tap-highlight-color-transparent"
      animate={{ y: [0, -20, 0] }}
      transition={{ 
        duration: 6, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      // Mouse Events
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      // Touch Events for Mobile
      onTouchStart={startPress}
      onTouchEnd={endPress}
    >
        {/* Charging Ring Indicator */}
        {isPressing && (
           <motion.div 
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 0.8, opacity: 1 }}
             className="absolute inset-0 rounded-[2.5rem] border-2 border-orange-500/50 z-20"
           />
        )}

        {/* Reflection/Light effect behind */}
        <div className="absolute inset-0 bg-orange-500/20 blur-[60px] rounded-full scale-150" />

        {/* The Object */}
        <motion.div 
            animate={controls}
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-2xl flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
        >
            
            {/* Inner Glare */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50" />
            
            {/* The Symbol - Custom Logo */}
            <svg 
              viewBox="0 0 971.67 987.87" 
              className="relative z-10 w-20 h-20 md:w-24 md:h-24 text-[#eb5a14] drop-shadow-[0_0_15px_rgba(235,90,20,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
                <g>
                    <path fill="currentColor" d="M266.51,174.37c23.74,0,35.63,28.7,18.84,45.49-40.98,40.98-202.11,202.1-239.86,239.86-16.79,16.79-45.49,4.9-45.49-18.84v-239.86c0-14.72,11.93-26.65,26.65-26.65h239.86Z"/>
                    <path fill="currentColor" d="M568.89,578.68c23.74,0,35.63,28.7,18.84,45.49l-189.33,189.33c-97.82,108.4-223.91,174.67-371.75,174.37-14.72,0-26.65-11.93-26.65-26.65v-355.89c0-14.72,11.93-26.65,26.65-26.65h542.24Z"/>
                    <path fill="currentColor" d="M971.67,26.65v350.62c0,14.72-11.93,26.65-26.65,26.65H412.23c-23.74,0-35.63-28.7-18.84-45.49l184.05-184.05C675.85,65.75,796.18.21,945.03,0c14.72,0,26.65,11.93,26.65,26.65Z"/>
                    <path fill="currentColor" d="M926.18,532.32l-235.69,235.69c-16.79,16.79-4.9,45.49,18.84,45.49h235.69c14.72,0,26.65-11.93,26.65-26.65v-235.69c0-23.74-28.7-35.63-45.49-18.84Z"/>
                </g>
            </svg>
            
            {/* Decorative Shine */}
            <motion.div 
                className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            />
        </motion.div>
    </motion.div>
  );
};