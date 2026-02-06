import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform, AnimatePresence } from 'framer-motion';

interface BackgroundProps {
  variant?: 'default' | 'vibrant';
}

// Generate random grid positions for the lights
const generateGridLights = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.floor(Math.random() * 100)}%`,
    top: `${Math.floor(Math.random() * 100)}%`,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 1.5
  }));
};

export const Background: React.FC<BackgroundProps> = ({ variant = 'default' }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [lights, setLights] = useState(generateGridLights(12));

  // Regenerate lights periodically when vibrant to keep it dynamic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (variant === 'vibrant') {
       interval = setInterval(() => {
         setLights(generateGridLights(12)); // Shuffle lights
       }, 3000);
    }
    return () => clearInterval(interval);
  }, [variant]);

  // Smooth springs for mouse tracking
  const springConfig = { stiffness: 100, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Spotlight effect - follows mouse
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${springX}px ${springY}px, rgba(${variant === 'vibrant' ? '0, 255, 255' : '255, 100, 0'}, 0.08), transparent 80%)`;

  // Parallax calculations
  const p1x = useTransform(springX, value => (value) * -0.02);
  const p1y = useTransform(springY, value => (value) * -0.02);

  const p2x = useTransform(springX, value => (value) * 0.04);
  const p2y = useTransform(springY, value => (value) * 0.04);

  const isVibrant = variant === 'vibrant';

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden transition-colors duration-1000 ${isVibrant ? 'bg-[#050a10]' : 'bg-[#050505]'}`}>
      
      {/* Mouse Spotlight / Torch Effect */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-screen transition-opacity duration-1000"
        style={{ background: spotlight }}
      />

      {/* Tech Grid Pattern */}
      <motion.div
        className="absolute inset-0 z-1 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVibrant ? 0.2 : 0 }}
        transition={{ duration: 1 }}
        style={{
            backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px),
                              linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      >
        {/* Dynamic Lights flowing through the grid */}
        <AnimatePresence>
          {isVibrant && lights.map((light) => (
            <motion.div
              key={light.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: light.duration, 
                repeat: Infinity, 
                repeatDelay: light.delay,
                ease: "easeInOut"
              }}
              className="absolute w-[50px] h-[50px] bg-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
              style={{ 
                left: light.left, 
                top: light.top,
                // Ensure it snaps to grid (assuming 50px grid size logic is visual only, but this helps randomness)
              }}
            >
               <div className="w-full h-full bg-cyan-200/50 blur-sm" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Blob 1 - Wrapper for Parallax */}
      <motion.div 
        className="absolute top-[10%] left-[20%]"
        style={{ x: p1x, y: p1y }}
      >
          <motion.div 
            className={`w-[60vw] h-[60vw] rounded-full blur-[120px] transition-colors duration-1000 ${isVibrant ? 'bg-cyan-500/30' : 'bg-orange-600/10'}`}
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 45, 0],
            }}
            transition={{ 
                duration: isVibrant ? 4 : 8, // Faster in vibrant mode
                repeat: Infinity, 
                ease: "easeInOut" 
            }}
          />
      </motion.div>

      {/* Blob 2 - Wrapper for Parallax */}
      <motion.div 
        className="absolute bottom-[10%] right-[10%]"
        style={{ x: p2x, y: p2y }}
      >
          <motion.div 
            className={`w-[70vw] h-[70vw] rounded-full blur-[150px] transition-colors duration-1000 ${isVibrant ? 'bg-fuchsia-600/30' : 'bg-neutral-800/10'}`}
            animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -30, 0],
            }}
            transition={{ 
                duration: isVibrant ? 5 : 10, // Faster in vibrant mode
                repeat: Infinity, 
                ease: "easeInOut" 
            }}
          />
      </motion.div>

      {/* Grain Overlay */}
      <div className="absolute inset-0 z-30 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 z-10 bg-radial-gradient from-transparent to-[#050505] opacity-80 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 40%, #050505 100%)' }}></div>
    </div>
  );
};