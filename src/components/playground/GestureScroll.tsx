import { useEffect, useRef, useState } from 'react';
import { useHandInput } from '../../hooks/useHandInput';

export default function GestureScroll() {
  const { landmarksRef, isCameraActive } = useHandInput();
  const isGrabbingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const smoothedScrollYRef = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!isCameraActive) return;

    let rafId: number;

    const loop = () => {
      const landmarks = landmarksRef.current;
      
      if (landmarks) {
          const wrist = landmarks[0];
          
          // Finger Tips
          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          const ringTip = landmarks[16];
          const pinkyTip = landmarks[20];
          
          // Finger PIPs (Knuckles/Mid-joints) for comparison
          // 6: Index PIP, 10: Middle PIP, 14: Ring PIP, 18: Pinky PIP
          const indexPIP = landmarks[6];
          const middlePIP = landmarks[10];
          const ringPIP = landmarks[14];
          const pinkyPIP = landmarks[18];
          
          // Calculate Distances from Wrist
          const dIndexTip = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
          const dIndexPIP = Math.hypot(indexPIP.x - wrist.x, indexPIP.y - wrist.y);
          
          const dMiddleTip = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
          const dMiddlePIP = Math.hypot(middlePIP.x - wrist.x, middlePIP.y - wrist.y);
          
          const dRingTip = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);
          const dRingPIP = Math.hypot(ringPIP.x - wrist.x, ringPIP.y - wrist.y);
          
          const dPinkyTip = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);
          const dPinkyPIP = Math.hypot(pinkyPIP.x - wrist.x, pinkyPIP.y - wrist.y);
          
          // Heuristic:
          // 1. Index & Middle Extended (Tip further than PIP)
          // 2. Ring & Pinky Closed (Tip closer than PIP or very close to wrist)
          
          const isIndexExtended = dIndexTip > dIndexPIP;
          const isMiddleExtended = dMiddleTip > dMiddlePIP;
          const isRingClosed = dRingTip < dRingPIP || dRingTip < 0.15; // 0.15 backup
          const isPinkyClosed = dPinkyTip < dPinkyPIP || dPinkyTip < 0.15;
          
          const isPeaceSign = isIndexExtended && isMiddleExtended && isRingClosed && isPinkyClosed;
          
          if (isPeaceSign) {
              const mainContainer = document.querySelector('main');
              
              if (!isGrabbingRef.current) {
                  // Start Scrolling Mode
                  isGrabbingRef.current = true;
                  lastScrollYRef.current = indexTip.y; // Track Index Finger
                  smoothedScrollYRef.current = indexTip.y; 
                  setIsScrolling(true);
                  
                  // Disable smooth scrolling on container for direct 1:1 control
                  if (mainContainer) {
                      mainContainer.style.scrollBehavior = 'auto'; 
                      mainContainer.style.scrollSnapType = 'none'; // DISABLE SNAPPING to prevent skipping
                  }
              } else {
                  // Dragging
                  // Track Index Finger Tip
                  // Smooth the input to remove hand jitter
                  smoothedScrollYRef.current += (indexTip.y - smoothedScrollYRef.current) * 0.15;
                  
                  const currentY = smoothedScrollYRef.current;
                  const deltaY = currentY - lastScrollYRef.current;
                  
                  // Sensitivity 3.0x (Maximum Speed)
                  const scrollSensitivity = window.innerHeight * 3.0;
                  
                  if (mainContainer) {
                      mainContainer.scrollBy({ top: -deltaY * scrollSensitivity, behavior: 'auto' });
                  } else {
                      window.scrollBy({ top: -deltaY * scrollSensitivity, behavior: 'auto' });
                  }
                  
                  lastScrollYRef.current = currentY;
              }
          } else {
              // Released
              if (isGrabbingRef.current) {
                  const mainContainer = document.querySelector('main');
                  if (mainContainer) {
                      mainContainer.style.scrollBehavior = 'smooth'; // Restore smooth scroll
                      mainContainer.style.scrollSnapType = 'y mandatory'; // RESTORE SNAPPING
                  }
              }
              isGrabbingRef.current = false;
              setIsScrolling(false);
          }
      } else {
          // No hand detected - release if needed
           if (isGrabbingRef.current) {
               isGrabbingRef.current = false;
               setIsScrolling(false);
               const mainContainer = document.querySelector('main');
               if (mainContainer) mainContainer.style.scrollBehavior = 'smooth';
           }
      }
      
      rafId = requestAnimationFrame(loop);
    };

    loop();
    
    return () => {
      cancelAnimationFrame(rafId);
      // Ensure cleanup
      const mainContainer = document.querySelector('main');
      if (mainContainer) {
          mainContainer.style.scrollBehavior = 'smooth';
          mainContainer.style.scrollSnapType = 'y mandatory';
      }
    };
  }, [isCameraActive, landmarksRef]);

  if (!isScrolling) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 text-white/20 text-xs pointer-events-none select-none flex flex-col items-end gap-1">
        <span className="text-yellow-400 font-bold animate-pulse">SCROLLING ACTIVE (Peace Sign)</span>
    </div>
  );
}
