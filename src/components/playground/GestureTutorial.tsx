import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GestureTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GestureTutorial({ isOpen, onClose }: GestureTutorialProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full relative shadow-2xl shadow-cyan-500/10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-square bg-black/50 rounded-xl mb-6 overflow-hidden border border-white/5 relative group">
                {/* Image Container */}
                 <img 
                   src="/assets/tutorials/peace_gesture_guide.png" 
                   alt="Peace Sign Gesture Guide" 
                   className="w-full h-full object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
                 />
                 
                 {/* Decorative glow behind image */}
                 <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                How to Scroll
              </h3>
              
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Make a <span className="text-cyan-400 font-medium">Peace Sign</span> to "grab" the page, then move your hand Up or Down.
              </p>

              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95 border border-white/5"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
