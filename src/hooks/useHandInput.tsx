import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode, RefObject, MutableRefObject } from 'react';
import { HandTracker } from '../components/playground/HandTracker';

interface GestureState {
  isOpen: boolean;
  isClosed: boolean;
  distance: number;
  scale: number;
  center: { x: number; y: number };
  isScrolling: boolean;
}

interface HandInputContextType {
  isCameraActive: boolean;
  toggleCamera: () => Promise<void>;
  videoRef: RefObject<HTMLVideoElement | null>;
  gestureStateRef: MutableRefObject<GestureState>;
  landmarksRef: MutableRefObject<any>; // Raw landmarks for specialized components like Scroll
}

const HandInputContext = createContext<HandInputContextType | null>(null);

export function HandInputProvider({ children }: { children: ReactNode }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handTrackerRef = useRef<HandTracker | null>(null);
  
  // Shared Mutable State (for high performance loops)
  const gestureStateRef = useRef<GestureState>({
    isOpen: false,
    isClosed: false,
    distance: 0,
    scale: 1.0,
    center: { x: 0.5, y: 0.5 },
    isScrolling: false
  });
  
  const landmarksRef = useRef<any>(null);
  
  // Smoothing refs (Internal to the provider)
  const smoothedScaleRef = useRef(1.0);
  const smoothedCenterRef = useRef({ x: 0.5, y: 0.5 });
  
  const onHandResults = useCallback((results: any) => {
      if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          landmarksRef.current = landmarks; // Store raw landmarks
          
          const wrist = landmarks[0];
          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          
          // 1. Gesture Detection (Open/Closed)
          const dIndex = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
          const dMiddle = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
          
          const isClosed = dIndex < 0.15 && dMiddle < 0.15;
          const isOpen = !isClosed;
          
          // 2. Center Calculation
          let cx = 0, cy = 0;
          landmarks.forEach((p: any) => { cx += p.x; cy += p.y; });
          cx /= landmarks.length;
          cy /= landmarks.length;
          cx = 1 - cx; // Mirror X
          
          // 3. Distance (Two Hands)
          let distance = 0.5;
          if (results.landmarks.length > 1) {
              const h2 = results.landmarks[1];
              let cx2 = 0, cy2 = 0;
              h2.forEach((p: any) => { cx2 += p.x; cy2 += p.y; });
              cx2 /= h2.length;
              cy2 /= h2.length;
              cx2 = 1 - cx2;
              distance = Math.hypot(cx - cx2, cy - cy2);
              cx = (cx + cx2) / 2;
              cy = (cy + cy2) / 2;
          }

          // 4. Scale / Zoom
          const middleMCP = landmarks[9];
          const handSize = Math.hypot(middleMCP.x - wrist.x, middleMCP.y - wrist.y);
          const baseSize = 0.15;
          let rawScale = handSize / baseSize;
          rawScale = Math.max(0.4, Math.min(rawScale, 3.0));
          
          // Apply Smoothing
          smoothedScaleRef.current += (rawScale - smoothedScaleRef.current) * 0.3;
          smoothedCenterRef.current.x += (cx - smoothedCenterRef.current.x) * 0.3;
          smoothedCenterRef.current.y += (cy - smoothedCenterRef.current.y) * 0.3;

          // Update Shared State
          Object.assign(gestureStateRef.current, {
              isOpen,
              isClosed,
              distance,
              scale: smoothedScaleRef.current,
              center: { ...smoothedCenterRef.current },
              isScrolling: gestureStateRef.current.isScrolling // Preserve value set by consumers
          });
      } else {
          landmarksRef.current = null;
      }
  }, []);

  const toggleCamera = async () => {
      if (isCameraActive) {
          handTrackerRef.current?.stop();
          if (videoRef.current && videoRef.current.srcObject) {
              const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
          }
          setIsCameraActive(false);
      } else {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                  await videoRef.current.play();
                  
                  if (!handTrackerRef.current) {
                      handTrackerRef.current = new HandTracker(onHandResults);
                      await handTrackerRef.current.initialize();
                  }
                  
                  handTrackerRef.current.start(videoRef.current);
                  setIsCameraActive(true);
              }
          } catch (err) {
              console.error("Camera denied", err);
              alert("Could not access camera.");
          }
      }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handTrackerRef.current?.stop();
       if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <HandInputContext.Provider value={{ 
        isCameraActive, 
        toggleCamera, 
        videoRef, 
        gestureStateRef,
        landmarksRef
    }}>
      {/* Hidden Video Element managed by Provider */}
      <video 
        ref={videoRef} 
        className="fixed bottom-4 left-4 w-32 h-24 object-cover opacity-50 rounded-lg z-50 pointer-events-none transform scale-x-[-1]" 
        style={{ display: isCameraActive ? 'block' : 'none' }}
        muted 
        playsInline 
      />
      {children}
    </HandInputContext.Provider>
  );
}

export function useHandInput() {
  const context = useContext(HandInputContext);
  if (!context) {
    throw new Error('useHandInput must be used within a HandInputProvider');
  }
  return context;
}
