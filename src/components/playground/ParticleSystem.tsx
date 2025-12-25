import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import ParticleEngine from './ParticleEngine';
import ControlPanel from './ControlPanel';
import GestureTutorial from './GestureTutorial';
import GestureScroll from './GestureScroll';
import GestureCelebration from './GestureCelebration';
import GestureShapeControl from './GestureShapeControl';
import { HandInputProvider, useHandInput } from '../../hooks/useHandInput';

function ParticleSystemContent() {
  const { isCameraActive, toggleCamera, gestureStateRef } = useHandInput();
  
  const [template, setTemplate] = useState('sphere');
  const [color, setColor] = useState('#ff4d4d');
  const [mounted, setMounted] = useState(false);
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);
  const hasSeenTutorialRef = useRef(false);

  // Trigger tutorial when camera activates for the first time
  useEffect(() => {
    if (isCameraActive && !hasSeenTutorialRef.current) {
      setShowTutorial(true);
      hasSeenTutorialRef.current = true;
    }
  }, [isCameraActive]);
  
  // Sync theme color with particle color
  useEffect(() => {
    // Helper to convert hex to HSL for CSS variables
    const hexToHSL = (hex: string) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
      } else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
      }
      r /= 255;
      g /= 255;
      b /= 255;
      const cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
      let h = 0, s = 0, l = 0;
      
      if (delta === 0) h = 0;
      else if (cmax === r) h = ((g - b) / delta) % 6;
      else if (cmax === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      
      l = (cmax + cmin) / 2;
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);
      
      return `${h} ${s}% ${l}%`;
    };

    const hsl = hexToHSL(color);
    document.documentElement.style.setProperty('--primary', hsl);
    document.documentElement.style.setProperty('--color-primary', hsl); 
  }, [color]);

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
      gestureStateRef.current.isOpen = false; // Default neutral (so shape forms at cursor)
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
  }, [isCameraActive, gestureStateRef]);

  
  // Cleanup
  useEffect(() => {
      setMounted(true);
  }, []);

  // --- Content-Aware Shape Switching ---
  useEffect(() => {
      const mainContainer = document.querySelector('main');
      if (!mainContainer) return;

      const handleScroll = () => {
          // Detect which section is in view
          // Since full-screen snapping, we can just check scroll offset / height
          const scrollY = mainContainer.scrollTop;
          const h = window.innerHeight;
          const sectionIndex = Math.round(scrollY / h);
          
          // Map to shapes
          // 0: Home -> Sphere
          // 1: About -> Saturn (Ring)
          // 2: Skills -> Flower (Complex)
          // 3: Projects -> Cube (Solid)
          // 4: Contact -> Heart (Calm)
          
          let newTemplate = 'sphere'; // Default
          
          switch(sectionIndex) {
              case 0: newTemplate = 'sphere'; break;
              case 1: newTemplate = 'saturn'; break;
              case 2: newTemplate = 'flower'; break;
              case 3: newTemplate = 'cube'; break;
              case 4: newTemplate = 'heart'; break;
              default: newTemplate = 'sphere';
          }
          
          // Only update if changed (React handles check mostly, but good for explicit debug)
          setTemplate(prev => {
              if (prev !== newTemplate) return newTemplate;
              return prev;
          });
      };
      
      mainContainer.addEventListener('scroll', handleScroll);
      return () => mainContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden pointer-events-none">
      
      {/* Scroll Logic Component (Independent) */}
      <GestureScroll />
      <GestureCelebration />
      <GestureShapeControl onTemplateChange={setTemplate} />

      {/* Render Controls via Portal to sit on top of everything (z-50 relative to body) */}
      {mounted && createPortal(
         <ControlPanel 
            isCameraActive={isCameraActive}
            onToggleCamera={toggleCamera}
            currentTemplate={template}
            onTemplateChange={setTemplate}
            onColorChange={setColor}
            onShowTutorial={() => setShowTutorial(true)}
          />,
         document.body
      )}
      
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <ParticleEngine 
            gestureState={gestureStateRef.current} 
             template={template}
             color={color}
          />
        </Canvas>
      </div>
      
      <div className="absolute bottom-4 right-4 z-40 text-white/20 text-xs pointer-events-none select-none flex flex-col items-end gap-1">
         {/* Scroll indicator moved to GestureScroll */}
         {isCameraActive ? 'Camera Tracking Active' : 'Mouse Interaction Active'}
      </div>

      {/* Tutorial Overlay */}
      {mounted && createPortal(
        <GestureTutorial 
          isOpen={showTutorial} 
          onClose={() => setShowTutorial(false)} 
        />,
        document.body
      )}
    </div>
  );
}

export default function ParticleSystem() {
    return (
        <HandInputProvider>
            <ParticleSystemContent />
        </HandInputProvider>
    );
}
