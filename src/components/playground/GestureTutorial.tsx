import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GestureTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GestureTutorial({ isOpen, onClose }: GestureTutorialProps) {
  const [step, setStep] = useState(0);

  // Reset step when opened
  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

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
              {/* Tutoral Content Swapper */}
              {step === 0 ? (
                <>
                  <div className="w-full aspect-square bg-black/50 rounded-xl mb-6 overflow-hidden border border-white/5 relative group">
                     <img 
                       src="/assets/tutorials/peace_gesture_guide.png" 
                       alt="Peace Sign Gesture Guide" 
                       className="w-full h-full object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">How to Scroll</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    Make a <span className="text-cyan-400 font-medium">Peace Sign</span> to "grab" the page, then move your hand Up or Down.
                  </p>
                </>
              ) : step === 1 ? (
                <>
                  <div className="w-full aspect-square bg-black/50 rounded-xl mb-6 overflow-hidden border border-white/5 relative group">
                     <img 
                       src="/assets/tutorials/thumbs_up_guide.png" 
                       alt="Thumbs Up Gesture Guide" 
                       className="w-full h-full object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Celebration Mode</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    Given a <span className="text-cyan-400 font-medium">Thumbs Up</span> to trigger a confetti explosion. Great for meaningful moments!
                  </p>
                </>
              ) : (
                <>
                  <div className="w-full aspect-square bg-black/50 rounded-xl mb-6 overflow-hidden border border-white/5 relative group">
                     <img 
                       src="/assets/tutorials/call_me_guide.png" 
                       alt="Call Me Gesture Guide" 
                       className="w-full h-full object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-pink-500/10 to-transparent pointer-events-none" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Shape Shifter</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    Make a <span className="text-pink-400 font-medium">Call Me</span> sign (Thumb + Pinky) to transform particles into a Heart!
                  </p>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                  {step > 0 && (
                    <button
                        onClick={() => setStep(prev => prev - 1)}
                        className="bg-white/5 hover:bg-white/10 text-white/50 px-6 py-3 rounded-full font-medium transition-all"
                    >
                        Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                        if (step < 2) setStep(prev => prev + 1);
                        else onClose();
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95 border border-white/5"
                  >
                    {step < 2 ? 'Next' : 'Got it'}
                  </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
