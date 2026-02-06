import React, { useState, useEffect, useCallback } from 'react';
import { Background } from './components/Background';
import { FloatingLogo } from './components/FloatingLogo';
import { RobotAssistant } from './components/RobotAssistant';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [bgVariant, setBgVariant] = useState<'default' | 'vibrant'>('default');

  // Centralized trigger function
  const triggerVibrantMode = useCallback(() => {
    setBgVariant('vibrant');
    // Revert after 10 seconds
    const timer = setTimeout(() => {
      setBgVariant('default');
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger on Ctrl + Shift + R
      if (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault(); 
        triggerVibrantMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerVibrantMode]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] text-neutral-200 selection:bg-orange-500/30 selection:text-orange-200">
      {/* Ambient Background - Premium Mesh Gradient with dynamic variant */}
      <Background variant={bgVariant} />

      {/* Main Container - Centered Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
        
        {/* Pass trigger function to logo for Long Press interaction */}
        <FloatingLogo onTriggerVibrant={triggerVibrantMode} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 text-center space-y-4"
        >
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white/90">
            Reconstruyendo la experiencia
          </h1>
          <p className="text-sm font-light tracking-wide text-white/40 uppercase">
            Altezza Pictures
          </p>
        </motion.div>

      </div>

      {/* Floating Assistant Overlay */}
      <RobotAssistant />
    </main>
  );
};

export default App;