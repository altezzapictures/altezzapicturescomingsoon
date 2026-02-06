import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Bot, ArrowRight } from 'lucide-react';

interface Message {
  id: number;
  content: React.ReactNode;
}

export const RobotAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  
  // Notification sound ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Using a louder, clearer 'pop' sound
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3'); 
    audioRef.current.volume = 1.0; 

    const initialTimer = setTimeout(() => {
        if (!isOpen) setShowTooltip(true);
        playSound();
    }, 5000); 

    return () => clearTimeout(initialTimer);
  }, []);

  // Handle Message Sequence when opened
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      // Reset messages if opening fresh
      if (visibleMessages.length === 0) {
        runMessageSequence();
      }
    } else {
      // Optional: Reset messages when closed? 
      // Let's keep them cleared so the sequence restarts for the full effect next time
      setVisibleMessages([]);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }
  }, [isOpen]);

  const playSound = () => {
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
    }
  };

  const runMessageSequence = () => {
    const sequence = [
      {
        id: 1,
        delay: 0,
        content: (
          <span>
            <span className="text-white font-medium">¡Hola!</span> Gracias por tu visita. Estamos reconstruyendo nuestro espacio digital para ofrecerte algo extraordinario.
          </span>
        )
      },
      {
        id: 2,
        delay: 3500,
        content: (
          <span>
            🤫 <span className="italic text-orange-200">Pssst...</span> ¿Quieres ver un secreto? 
            <br/><br/>
            Presiona <strong className="text-white bg-white/10 px-1 rounded border border-white/10">Ctrl + Shift + R</strong> 
            <br/> o <span className="text-orange-300">mantén presionado el logo central</span> por 2 segundos.
          </span>
        )
      },
      {
        id: 3,
        delay: 7500,
        content: (
          <span>
            Mientras tú exploras eso, yo seguiré aquí construyendo el futuro. 🚀
          </span>
        )
      }
    ];

    sequence.forEach((item) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, { id: item.id, content: item.content }]);
        playSound();
      }, item.delay);
      timeoutsRef.current.push(timeout);
    });
  };

  return (
    <div className="fixed bottom-10 right-8 md:bottom-12 md:right-12 z-50 flex flex-col items-end gap-6 font-sans">
      
      {/* The Main Card (Expanded) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-[#161617]/90 border border-white/10 backdrop-blur-3xl p-6 rounded-[2rem] shadow-2xl w-[340px] origin-bottom-right overflow-hidden flex flex-col"
          >
            {/* Subtle Gradient background inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center shadow-lg border border-white/10">
                    <Bot className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white tracking-wide leading-none">Asistente</span>
                    <span className="text-[10px] text-green-400 font-medium tracking-wider mt-1 uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/> Online
                    </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Chat Area */}
            <div className="space-y-3 relative z-10 mb-6 min-h-[60px]">
                <AnimatePresence mode='popLayout'>
                    {visibleMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3.5"
                        >
                            <p className="text-neutral-200 text-[14px] leading-relaxed font-light">
                                {msg.content}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {/* Typing indicator if messages are still coming (simple logic based on count) */}
                {visibleMessages.length < 3 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-1 pl-2"
                    >
                        <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"/>
                        <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"/>
                        <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce"/>
                    </motion.div>
                )}
            </div>

            {/* Footer / Link */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              className="relative z-10 mt-auto"
            >
                <a 
                href="https://www.instagram.com/altezzagroup/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl text-white shadow-lg group-hover:shadow-orange-500/20 transition-shadow duration-300">
                        <Instagram size={18} className="group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white group-hover:text-orange-100 transition-colors">Síguenos</span>
                        <span className="text-[11px] text-neutral-500 group-hover:text-neutral-400 transition-colors">@altezzagroup</span>
                    </div>
                </div>
                <ArrowRight size={16} className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-end">
        {/* "Wait!" Notification Bubble */}
        <AnimatePresence>
            {!isOpen && showTooltip && (
                <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => { setIsOpen(true); setShowTooltip(false); }}
                    className="absolute right-[88px] cursor-pointer bg-white/10 backdrop-blur-xl border border-white/10 text-white px-5 py-3 rounded-2xl shadow-xl z-40 flex items-center gap-3 max-w-[200px]"
                >
                     <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                     <span className="text-sm font-medium whitespace-nowrap">¡No te vayas!</span>
                </motion.div>
            )}
        </AnimatePresence>

        {/* The Floating Trigger Button */}
        <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border relative group shadow-2xl backdrop-blur-xl
            ${isOpen 
                ? 'bg-neutral-800 border-neutral-700 text-white' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
        >
            {/* Inner Gradient Orb effect */}
            {!isOpen && (
                <div className="absolute inset-1 rounded-full bg-gradient-to-b from-orange-500/80 to-orange-600/80 opacity-90 blur-[1px] shadow-inner border border-white/20" />
            )}
            
            <div className="relative z-10">
                {isOpen ? (
                    <X size={24} /> 
                ) : (
                    <Bot size={28} className="text-white drop-shadow-md" strokeWidth={1.5} />
                )}
            </div>

            {/* Notification Dot */}
            {!isOpen && (
                <div className="absolute -top-1 -right-1 z-20">
                    <motion.div 
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-4 h-4 bg-[#28cd41] border-[3px] border-[#050505] rounded-full shadow-sm"
                    />
                </div>
            )}
        </motion.button>
      </div>
    </div>
  );
};