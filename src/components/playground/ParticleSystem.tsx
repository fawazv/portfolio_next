'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { HandTracker } from './HandTracker';
import ParticleEngine from './ParticleEngine';
import ControlPanel from './ControlPanel';

export default function ParticleSystem() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [template, setTemplate] = useState('heart');
  const [color, setColor] = useState('#ff4d4d');
  
  // Gesture state passed to engine (ref for performance, or state if using React render cycle usually fine for this frequency)
  // Engine uses ref internally, but we need to pass data. Frame loop in engine reads it.
  // Actually, passing an object ref or updating a ref via prop is better to avoid re-renders of the Canvas
  // But for now, let's use simple state to trigger updates or just pass a mutable object.
  // Let's use a mutable ref for gesture state that we pass down.
  const gestureStateRef = useRef({
    isOpen: false,
    isClosed: false,
    distance: 0,
    center: { x: 0.5, y: 0.5 }
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const handTrackerRef = useRef<HandTracker | null>(null);

  // Mouse fallback
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isCameraActive) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Map mouse to gesture state
      gestureStateRef.current.center = { x, y };
      
      // Click implies "action" (close/open)
      const isClicking = e.buttons > 0;
      gestureStateRef.current.isClosed = isClicking;
      gestureStateRef.current.isOpen = !isClicking; // Default open?
      gestureStateRef.current.distance = 0.5; // Default distance
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', () => { if(!isCameraActive) gestureStateRef.current.isClosed = true; });
    window.addEventListener('mouseup', () => { if(!isCameraActive) gestureStateRef.current.isClosed = false; });
    
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', () => {});
        window.removeEventListener('mouseup', () => {});
    };
  }, [isCameraActive]);

  const onHandResults = useCallback((results: any) => {
      if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0]; // Use first hand
          
          // Detect Open/Closed (Fist)
          // Simple heuristic: tips of fingers vs wrist distance? Or tip vs base.
          // IsClosed if finger tips are close to palm.
          const wrist = landmarks[0];
          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          
          // Distance tip to wrist
          const dIndex = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
          const dMiddle = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
          
          const isClosed = dIndex < 0.15 && dMiddle < 0.15; // Calibration needed
          const isOpen = !isClosed;
          
          // Detect Center
          let cx = 0, cy = 0;
          landmarks.forEach((p: any) => { cx += p.x; cy += p.y; });
          cx /= landmarks.length;
          cy /= landmarks.length;
          
          // Distance (if two hands)
          let distance = 0.5;
          if (results.landmarks.length > 1) {
              const h2 = results.landmarks[1];
              let cx2 = 0, cy2 = 0;
              h2.forEach((p: any) => { cx2 += p.x; cy2 += p.y; });
              cx2 /= h2.length;
              cy2 /= h2.length;
              
              distance = Math.hypot(cx - cx2, cy - cy2);
              
              // Average center of two hands
              cx = (cx + cx2) / 2;
              cy = (cy + cy2) / 2;
          }

          gestureStateRef.current = {
              isOpen,
              isClosed,
              distance,
              center: { x: cx, y: cy } // MediaPipe 0..1
          };
      } else {
        // No hand detected, maybe idle state or keep last
      }
  }, []);

  const toggleCamera = async () => {
      if (isCameraActive) {
          // Turn off
          handTrackerRef.current?.stop();
          if (videoRef.current && videoRef.current.srcObject) {
              const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
          }
          setIsCameraActive(false);
      } else {
          // Turn on
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                  videoRef.current.play();
                  
                  if (!handTrackerRef.current) {
                      handTrackerRef.current = new HandTracker(onHandResults);
                      await handTrackerRef.current.initialize();
                  }
                  
                  handTrackerRef.current.start(videoRef.current);
                  setIsCameraActive(true);
              }
          } catch (err) {
              console.error("Camera denied or error", err);
              alert("Could not access camera. Please allow permission.");
          }
      }
  };
  
  // Cleanup
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hidden Video Element for Analysis */}
      <video 
        ref={videoRef} 
        className="absolute bottom-4 left-4 w-32 h-24 object-cover opacity-50 rounded-lg z-50 pointer-events-none transform scale-x-[-1]" 
        style={{ display: isCameraActive ? 'block' : 'none' }}
        muted 
        playsInline 
      />

      <ControlPanel 
        isCameraActive={isCameraActive}
        onToggleCamera={toggleCamera}
        currentTemplate={template}
        onTemplateChange={setTemplate}
        onColorChange={setColor}
      />
      
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <ParticleEngine 
            gestureState={gestureStateRef.current} // Note: this won't trigger re-renders of Engine if ref changes, but Engine reads ref in loop?
            // Actually, ParticleEngine receives the *value* of the ref at render time.
            // But we want it to read the *current* value every frame. 
            // So we should pass the REF itself or the mutable object.
            // Let's pass the object, but since the object reference (pointer) doesn't change 
            // (we mutate properties of current), verify ParticleEngine reads properties in useFrame.
            // Yes, ParticleEngine.tsx receives `gestureState` and uses standard check.
            // Wait, if I pass `gestureStateRef.current`, I am passing the object. 
            // If I mutate that object's properties, the Engine (which holds a reference to it) will see changes.
            // Correct.
             template={template}
             color={color}
          />
        </Canvas>
      </div>
      
      <div className="absolute bottom-4 right-4 z-40 text-white/20 text-xs pointer-events-none select-none">
         {isCameraActive ? 'Camera Tracking Active' : 'Mouse Interaction Active'}
      </div>
    </div>
  );
}
