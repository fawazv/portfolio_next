import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

interface ParticleEngineProps {
  gestureState: {
    isOpen: boolean; // Hands open/tension -> expansion
    isClosed: boolean; // Hands closed/fist -> contraction
    distance: number; // Distance between hands
    scale?: number;   // Distance from camera (Hand scale)
    center: { x: number, y: number }; // Center point between hands
    isScrolling?: boolean; // NEW: Lock flag
  };
  template: string;
  color: string;
}

const PARTICLE_COUNT = 4000;

export default function ParticleEngine({ gestureState, template, color }: ParticleEngineProps) {
  const meshRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree();
  
  // Initialize particles
  const { positions, randoms, sizes, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const rnd = new Float32Array(PARTICLE_COUNT * 3);
    const siz = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    
    const c = new THREE.Color(color);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Initial random positions sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 2 * Math.cbrt(Math.random()); 
        
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);

        rnd[i * 3] = (Math.random() - 0.5) * 2;
        rnd[i * 3 + 1] = (Math.random() - 0.5) * 2;
        rnd[i * 3 + 2] = (Math.random() - 0.5) * 2;

        siz[i] = Math.random();
        
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
    }

    return { 
        positions: pos, 
        randoms: rnd, 
        sizes: siz,
        colors: col
    };
  }, []); // Only run once on mount

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSize: { value: 0.4 }, // Reduced size to prevent sticky look
    uScale: { value: 1.0 },
  }), []);

  // Target positions (Float32Array) to avoid re-calculation and GC every frame
  const targetPositions = useRef(new Float32Array(PARTICLE_COUNT * 3));

  // Recalculate targets only when template changes
  useEffect(() => {
     const targets = targetPositions.current;
     for(let i=0; i<PARTICLE_COUNT; i++) {
        const idx = i * 3;
        let x = 0, y = 0, z = 0;
        
        switch (template) {
            case 'heart': {
                 // 2D heart projected + depth noise
                 const t2 = Math.random() * Math.PI * 2;
                 x = (16 * Math.pow(Math.sin(t2), 3)) / 10;
                 y = (13 * Math.cos(t2) - 5 * Math.cos(2 * t2) - 2 * Math.cos(3 * t2) - Math.cos(4 * t2)) / 10;
                 z = (Math.random() - 0.5) * 2;
                 break;
            }
            case 'saturn': {
                if (i < PARTICLE_COUNT * 0.3) {
                     const u = Math.random();
                     const v = Math.random();
                     const theta = 2 * Math.PI * u;
                     const phi = Math.acos(2 * v - 1);
                     const r = 1.0;
                     x = r * Math.sin(phi) * Math.cos(theta);
                     y = r * Math.sin(phi) * Math.sin(theta);
                     z = r * Math.cos(phi);
                } else {
                     const th = Math.random() * Math.PI * 2;
                     const dist = 1.6 + Math.random() * 0.8;
                     x = dist * Math.cos(th);
                     z = dist * Math.sin(th);
                     y = (Math.random() - 0.5) * 0.1;
                     
                     // Tilt
                     const tilt = 0.4;
                     const y_new = y * Math.cos(tilt) - x * Math.sin(tilt);
                     const x_new = y * Math.sin(tilt) + x * Math.cos(tilt);
                     x = x_new;
                     y = y_new;
                }
                break;
            }
            case 'flower': {
                const k = 4;
                const theta = (i / PARTICLE_COUNT) * Math.PI * 2 * 50;
                const rad = Math.cos(k * theta) * 2 + 0.5;
                x = rad * Math.cos(theta);
                y = rad * Math.sin(theta);
                z = (Math.random() - 0.5);
                break;
            }
            case 'buddha': {
                if (i < PARTICLE_COUNT * 0.15) {
                    const r = 0.5;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    x = r * Math.sin(phi) * Math.cos(theta);
                    y = r * Math.sin(phi) * Math.sin(theta) + 1.2;
                    z = r * Math.cos(phi);
                } else {
                     const h = 2.0; 
                     const r_base = 1.5;
                     const y_pos = (Math.random() * h) - 1.0;
                     const r_at_y = r_base * (1 - (y_pos + 1.0)/h);
                     const theta = Math.random() * Math.PI * 2;
                     x = r_at_y * Math.cos(theta);
                     y = y_pos;
                     z = r_at_y * Math.sin(theta);
                }
                break;
            }
            case 'fireworks': {
                 const u = Math.random();
                 const v = Math.random();
                 const theta = 2 * Math.PI * u;
                 const phi = Math.acos(2 * v - 1);
                 const r = 2.5 + Math.random(); 
                 x = r * Math.sin(phi) * Math.cos(theta);
                 y = r * Math.sin(phi) * Math.sin(theta);
                 z = r * Math.cos(phi);
                 break;
            }
            case 'sphere': {
                 // Fibonacci Sphere for even distribution
                 const goldenRatio = (1 + 5**0.5) / 2;
                 const i2 = i + 1; // 1-based index
                 const theta = 2 * Math.PI * i2 / goldenRatio;
                 const phi = Math.acos(1 - 2 * (i2 + 0.5) / PARTICLE_COUNT);
                 const r = 2.0 + (Math.random() - 0.5) * 0.5;
                 x = r * Math.sin(phi) * Math.cos(theta);
                 y = r * Math.sin(phi) * Math.sin(theta);
                 z = r * Math.cos(phi);
                 break;
            }
            case 'cube': {
                // Random point inside a cube
                const size = 2.5; 
                x = (Math.random() - 0.5) * size;
                y = (Math.random() - 0.5) * size;
                z = (Math.random() - 0.5) * size;
                
                // Optional: Make it a wireframe cube/hollow? 
                // Let's stick to solid volume for now as requested "Structured, solid"
                break;
            }
            default: { 
                 const u = Math.random();
                 const v = Math.random();
                 const theta = 2 * Math.PI * u;
                 const phi = Math.acos(2 * v - 1);
                 const r = 3 * Math.cbrt(Math.random());
                 x = r * Math.sin(phi) * Math.cos(theta);
                 y = r * Math.sin(phi) * Math.sin(theta);
                 z = r * Math.cos(phi);
            }
        }
        
        targets[idx] = x;
        targets[idx+1] = y;
        targets[idx+2] = z;
     }
  }, [template]);

  // Current positions of particles
  const currentPositions = useRef(new Float32Array(PARTICLE_COUNT * 3));
  // Velocities
  const velocities = useRef(new Float32Array(PARTICLE_COUNT * 3));
  
  // Initialize current positions same as initial
  useEffect(() => {
     for(let i=0; i<PARTICLE_COUNT*3; i++) {
         currentPositions.current[i] = positions[i];
         velocities.current[i] = 0;
     }
  }, [positions]);



  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    uniforms.uTime.value += delta;
    
    // Logic for particles
    const positionsAttr = meshRef.current.geometry.attributes.position;
    const array = positionsAttr.array as Float32Array;
    const targets = targetPositions.current; // Read from pre-calc array
    
    // De-structure lock
    const { isOpen, isClosed, distance, center, scale: handScale, isScrolling } = gestureState;

    // --- Camera Zoom Logic (Butter Smooth) ---
    // Base distance ~5.0
    const targetZ = 5.0 / (handScale || 1.0);
    const clampedZ = THREE.MathUtils.clamp(targetZ, 2.0, 10.0);
    // Heavy lerp for cinematic zoom
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, clampedZ, 0.02);
    
    // --- Rotation Logic (Butter Smooth) ---
    // DISABLED as per user request to improve movement feel
    // const targetRotY = (center.x - 0.5) * 2.0; 
    // const targetRotX = (center.y - 0.5) * 2.0; 

    // Apply rotation to the whole mesh group
    // meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.02);
    // meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.02);

    // Interaction coefficients
    // Boosted for snappy response (Fixes "slowly changing shape")
    // DISABLE if scrolling
    const active = !isScrolling;
    
    const attraction = (isClosed && active) ? 6.0 : 3.0; // Strong implosion (6.0), Fast shape form (3.0)
    const repulsion = (isOpen && active) ? 4.0 : 0.0; // Strong explosion
    const spread = distance * 2.0; // Global spread based on hand distance
    
    // Convert gesture center to world space
    // Sensitivity reset to 1.0x (Standard)
    const cx = (center.x - 0.5) * viewport.width; 
    const cy = -(center.y - 0.5) * viewport.height;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        
        // Physics
        // 1. Seek target (Template shape)
        // Apply scaling based on fist/open state
        let scale = 1.0;
        if (isClosed) scale = 0.5; // Shrink when closed
        if (isOpen) scale = 1.2;   // Expand when open

        const tx = (targets[idx] * scale) + cx; 
        const ty = (targets[idx+1] * scale) + cy;
        const tz = (targets[idx+2] * scale);
        
        // Current pos
        const x = array[idx];
        const y = array[idx + 1];
        const z = array[idx + 2];

        const dx = tx - x;
        const dy = ty - y;
        const dz = tz - z;
        
        // Spring force to target
        let fx = dx * attraction; 
        let fy = dy * attraction;
        let fz = dz * attraction;
        
        // 2. Gesture Influence (Direct Center)
        const gdx = x - cx;
        const gdy = y - cy;
        const gdz = z - 0;
        
        const gDistSq = gdx*gdx + gdy*gdy + gdz*gdz;
        const gDist = Math.sqrt(gDistSq) + 0.01;
        
        if (isOpen) {
             // Repulsion (Explosion)
             const force = 15.0 / (gDist + 0.1);
             fx += gdx * force;
             fy += gdy * force;
             fz += gdz * force;
        }
        
        // 3. Noise / Wander
        fx += Math.sin(uniforms.uTime.value * 2 + i) * 0.5;
        fy += Math.cos(uniforms.uTime.value * 2 + i) * 0.5;
        
        // Integration
        velocities.current[idx] += fx * delta;
        velocities.current[idx+1] += fy * delta;
        velocities.current[idx+2] += fz * delta;
        
        // Dampening
        const damp = 0.92; 
        velocities.current[idx] *= damp;
        velocities.current[idx+1] *= damp;
        velocities.current[idx+2] *= damp;
        
        // Update
        array[idx] += velocities.current[idx] * delta;
        array[idx+1] += velocities.current[idx+1] * delta;
        array[idx+2] += velocities.current[idx+2] * delta;
    }
    
    positionsAttr.needsUpdate = true;
  });

  // Update colors when prop changes
  useEffect(() => {
      if (!meshRef.current) return;
      const c = new THREE.Color(color);
      const colorsAttr = meshRef.current.geometry.attributes.color;
      const arr = colorsAttr.array as Float32Array;
      
      for(let i=0; i<PARTICLE_COUNT; i++) {
        // Add subtle variation
        arr[i*3] = c.r + (Math.random()-0.5)*0.1;
        arr[i*3+1] = c.g + (Math.random()-0.5)*0.1;
        arr[i*3+2] = c.b + (Math.random()-0.5)*0.1;
      }
      colorsAttr.needsUpdate = true;
  }, [color]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
           attach="attributes-color"
           args={[colors, 3]}
        />
         <bufferAttribute
           attach="attributes-size"
           args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}
