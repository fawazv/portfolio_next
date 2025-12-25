import { useEffect, useRef, useState } from 'react';
import { useHandInput } from '../../hooks/useHandInput';
import confetti from 'canvas-confetti';

export default function GestureCelebration() {
  const { landmarksRef, isCameraActive, gestureStateRef } = useHandInput();
  const lastTriggerTime = useRef(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!isCameraActive) return;

    let rafId: number;

    const loop = () => {
      // Global Lock Check
      if (gestureStateRef.current.isScrolling) {
           rafId = requestAnimationFrame(loop);
           return;
      }

      const landmarks = landmarksRef.current;
      
      if (landmarks) {
          const wrist = landmarks[0];
          
          // Thumb
          const thumbCMC = landmarks[1];
          const thumbMCP = landmarks[2];
          const thumbIP = landmarks[3];
          const thumbTip = landmarks[4];

          // Finger Tips
          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          const ringTip = landmarks[16];
          const pinkyTip = landmarks[20];
          
          // Finger PIPs (Knuckles/Mid-joints)
          const indexMCP = landmarks[5];
          const indexPIP = landmarks[6];
          const middlePIP = landmarks[10];
          const ringPIP = landmarks[14];
          const pinkyPIP = landmarks[18];

          // Calculate Distances from Wrist (to check if closed)
          const dIndexTip = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
          const dIndexPIP = Math.hypot(indexPIP.x - wrist.x, indexPIP.y - wrist.y);
          
          const dMiddleTip = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
          const dMiddlePIP = Math.hypot(middlePIP.x - wrist.x, middlePIP.y - wrist.y);
          
          const dRingTip = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);
          const dRingPIP = Math.hypot(ringPIP.x - wrist.x, ringPIP.y - wrist.y);
          
          const dPinkyTip = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);
          const dPinkyPIP = Math.hypot(pinkyPIP.x - wrist.x, pinkyPIP.y - wrist.y);

          // Thumbs Up Logic:
          // 1. Thumb Extended Upward (Tip Y significantly above Index MCP)
          // 2. Thumb Tip far from Index MCP (Extended)
          // 3. Others Closed (Tips closer to wrist than PIPs)
          
          // Check if thumb tip is higher than index knuckle (remember Y is inverted, 0 is top)
          const isThumbHigh = thumbTip.y < (indexMCP.y - 0.05); 
          
          // Check if thumb is actually extended (distance from knuckle)
          const thumbLen = Math.hypot(thumbTip.x - indexMCP.x, thumbTip.y - indexMCP.y);
          const isThumbExtended = thumbLen > 0.15;

          // Strict closure checks for other fingers
          const isIndexClosed = dIndexTip < dIndexPIP;
          const isMiddleClosed = dMiddleTip < dMiddlePIP;
          const isRingClosed = dRingTip < dRingPIP;
          const isPinkyClosed = dPinkyTip < dPinkyPIP;

          if (isThumbHigh && isThumbExtended && isIndexClosed && isMiddleClosed && isRingClosed && isPinkyClosed) {
              const now = Date.now();
              if (now - lastTriggerTime.current > 2500) { // 2.5s debouce
                  lastTriggerTime.current = now;
                  triggerCelebration();
                  setShowFeedback(true);
                  setTimeout(() => setShowFeedback(false), 2000);
              }
          }
      }
      
      rafId = requestAnimationFrame(loop);
    };

    loop();
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isCameraActive, landmarksRef]);

  const triggerCelebration = () => {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
  };

  if (!showFeedback) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-bounce-in">
             <div className="flex flex-col items-center gap-2">
                 <span className="text-4xl">👍</span>
                 <span className="text-yellow-400 font-bold text-lg tracking-wider">GREAT JOB!</span>
             </div>
        </div>
    </div>
  );
}
