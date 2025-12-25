import { useEffect, useRef, useState } from 'react';
import { useHandInput } from '../../hooks/useHandInput';

interface GestureShapeControlProps {
  onTemplateChange: (template: string) => void;
}

export default function GestureShapeControl({ onTemplateChange }: GestureShapeControlProps) {
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
          const thumbTip = landmarks[4];
          const thumbIP = landmarks[3];
          
          // Fingers
          const indexPIP = landmarks[6];
          const indexTip = landmarks[8];
          
          const middlePIP = landmarks[10];
          const middleTip = landmarks[12];
          
          const ringPIP = landmarks[14];
          const ringTip = landmarks[16];
          
          const pinkyPIP = landmarks[18];
          const pinkyTip = landmarks[20];

          // Distances
          const dIndexTip = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
          const dIndexPIP = Math.hypot(indexPIP.x - wrist.x, indexPIP.y - wrist.y);
          
          const dMiddleTip = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
          const dMiddlePIP = Math.hypot(middlePIP.x - wrist.x, middlePIP.y - wrist.y);
          
          const dRingTip = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);
          const dRingPIP = Math.hypot(ringPIP.x - wrist.x, ringPIP.y - wrist.y);
          
          const dPinkyTip = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);
          const dPinkyPIP = Math.hypot(pinkyPIP.x - wrist.x, pinkyPIP.y - wrist.y);

          // Call Me Logic:
          // 1. Thumb Extended
          // 2. Pinky Extended
          // 3. Index, Middle, Ring Closed
          
          // Check Thumb Extended (Simple distance check)
          const indexMCP = landmarks[5]; 
          const thumbLen = Math.hypot(thumbTip.x - indexMCP.x, thumbTip.y - indexMCP.y);
          const isThumbExtended = thumbLen > 0.15;

          // Check Pinky Extended
          const isPinkyExtended = dPinkyTip > dPinkyPIP;

          // Check Others Closed
          const isIndexClosed = dIndexTip < dIndexPIP;
          const isMiddleClosed = dMiddleTip < dMiddlePIP;
          const isRingClosed = dRingTip < dRingPIP;

          if (isThumbExtended && isPinkyExtended && isIndexClosed && isMiddleClosed && isRingClosed) {
              const now = Date.now();
              if (now - lastTriggerTime.current > 2000) { // 2s debounce
                  lastTriggerTime.current = now;
                  onTemplateChange('heart');
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
  }, [isCameraActive, landmarksRef, onTemplateChange]);

  if (!showFeedback) return null;

  return (
    <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-pink-500/30 flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-bounce-in">
             <span className="text-2xl">🤙</span>
             <span className="text-pink-400 font-bold tracking-wide">SHAPE SHIFT: HEART</span>
        </div>
    </div>
  );
}
