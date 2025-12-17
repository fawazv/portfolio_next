import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

interface ParticleEngineProps {
  gestureState: {
    isOpen: boolean; // Hands open/tension -> expansion
    isClosed: boolean; // Hands closed/fist -> contraction
    distance: number; // Distance between hands
    center: { x: number, y: number }; // Center point between hands
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
  }, []); // Only run once on mount, color changes handled in uniform/frame

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSize: { value: 2.0 }, // Base size
    uScale: { value: 1.0 },
  }), []);

  // Update target positions based on template
  const targetPositions = useMemo(() => {
      const targets = new Float32Array(PARTICLE_COUNT * 3);
      // We can generate different shapes here. 
      // For simplicity/performance, we'll calculate target positions on the fly or pre-calc here.
      // Let's pre-calc strict shapes for 'heart', 'flower', etc. to lerp towards.
      return targets;
  }, [template]); // Re-calc when template changes? Or handle in loop.

  // Helper to generate shapes
  const getTargetPosition = (i: number, template: string) => {
    const ix = i; 
    let x = 0, y = 0, z = 0;
    
    switch (template) {
        case 'heart': {
             // Heart shape formula
             const t = (ix / PARTICLE_COUNT) * Math.PI * 2;
             // Lissajous-ish or explicit heart curve
             // x = 16sin^3(t)
             // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
             // Need to distribute points inside the volume or on surface
             // Let's use rejection sampling or a parameterized surface for 3D heart
             const phi = Math.acos(1 - 2 * Math.random());
             const theta = Math.sqrt(Math.PI * PARTICLE_COUNT) * phi;
             
             // Simple approx: 
             // Scale down to fit viewport
             const r = 1.5;
             x = r * 16 * Math.pow(Math.sin(theta), 3);
             z = r * (13 * Math.cos(theta) - 5 * Math.cos(2*theta) - 2 * Math.cos(3*theta) - Math.cos(4*theta));
             y = (Math.random() - 0.5) * 2; // Extrude slightly
             
             // Actually, 2D heart projected + depth noise is easier visually
             const t2 = Math.random() * Math.PI * 2;
             const r2 = Math.sqrt(Math.random());
             // x = r2 * 16 * sin^3(t2)
             // y = r2 * (13cos(t2)...)
             x = (16 * Math.pow(Math.sin(t2), 3)) / 10;
             y = (13 * Math.cos(t2) - 5 * Math.cos(2 * t2) - 2 * Math.cos(3 * t2) - Math.cos(4 * t2)) / 10;
             z = (Math.random() - 0.5) * 2;
             break;
        }
        case 'saturn': {
            // Planet + Ring
            if (i < PARTICLE_COUNT * 0.3) {
                 // Planet sphere
                 const u = Math.random();
                 const v = Math.random();
                 const theta = 2 * Math.PI * u;
                 const phi = Math.acos(2 * v - 1);
                 const r = 1.0;
                 x = r * Math.sin(phi) * Math.cos(theta);
                 y = r * Math.sin(phi) * Math.sin(theta);
                 z = r * Math.cos(phi);
            } else {
                 // Ring
                 const angle = (i / (PARTICLE_COUNT * 0.7)) * Math.PI * 2 * 20; // Multiple loops? no just random
                 const dist = 1.6 + Math.random() * 0.8;
                 const th = Math.random() * Math.PI * 2;
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
            // Rose curve: r = cos(k * theta)
            const k = 4; // petals
            const theta = (i / PARTICLE_COUNT) * Math.PI * 2 * 50; // Scatter
            const rad = Math.cos(k * theta) * 2 + 0.5; // +0.5 to fill center
            x = rad * Math.cos(theta);
            y = rad * Math.sin(theta);
            z = (Math.random() - 0.5);
            break;
        }
        case 'buddha': {
            // Approximate with a simple seated triangle/stack for now as no mesh data
            // Head
            if (i < PARTICLE_COUNT * 0.15) {
                const r = 0.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta) + 1.2;
                z = r * Math.cos(phi);
            } else {
                // Body (Cone-ish)
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
             // Explosion sphere
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
        default: { // Cloud/Random
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
    return new THREE.Vector3(x, y, z);
  }

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
    
    // Update colors smoothly
    const targetC = new THREE.Color(color);
    // This is expensive to do per frame for all particles on CPU. 
    // Ideally we pass color as uniform since all particles have same base color?
    // Yes, let's optimize: use uniform for base color and attribute for variation.
    // But shader uses 'color' attribute. We can write to attribute sparingly.
    // For now, let's rely on the additive blending and vertex colors set initially 
    // mixed with a global uniform color if we wanted, but the prompt says "updates particle color".
    // I will simply re-write valid colors in the attribute buffer if color changes significantly? 
    // Or better: update a uniform `uColor` and mix it in shader.
    // For simplicity with provided shader: update VBO.
    const colorsAttr = meshRef.current.geometry.attributes.color;
    // We'll skip per-frame color update on CPU for performance, 
    // only update when prop changes. Handled by a useEffect below if needed.
    
    // Logic for particles
    const positionsAttr = meshRef.current.geometry.attributes.position;
    const array = positionsAttr.array as Float32Array;
    
    const { isOpen, isClosed, distance, center } = gestureState;
    
    // Interaction coefficients
    const attraction = isClosed ? 2.5 : 0.5; // Strong attraction when closed
    const repulsion = isOpen ? 2.0 : 0.0; // Repulsion when open
    const spread = distance * 2.0; // Global spread based on hand distance
    
    // Mouse fallback if no hands? 
    // Engine receives gestureState, which can be driven by mouse in parent if needed.
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        
        // Target pos
        const seed = getTargetPosition(i, template);
        
        // Current pos
        let x = array[idx];
        let y = array[idx + 1];
        let z = array[idx + 2];
        
        // Physics
        // 1. Seek target (Template shape)
        const dx = seed.x * (1 + spread * 0.5) - x;
        const dy = seed.y * (1 + spread * 0.5) - y;
        const dz = seed.z * (1 + spread * 0.5) - z;
        
        const distSq = dx*dx + dy*dy + dz*dz;
        // const dist = Math.sqrt(distSq);
        
        // Force applied
        let fx = dx * 1.5; // Spring strength to target
        let fy = dy * 1.5;
        let fz = dz * 1.5;
        
        // 2. Gesture Influence (Center)
        // If closed, suck into center. If open, explode directly out from center.
        // Convert gesture center (screen space -1 to 1) to world space approx
        // viewport.width is available
        const cx = (center.x - 0.5) * viewport.width; 
        const cy = -(center.y - 0.5) * viewport.height;
        
        const gdx = x - cx;
        const gdy = y - cy;
        const gdz = z - 0; // Assume interaction plane at z=0
        
        const gDistSq = gdx*gdx + gdy*gdy + gdz*gdz;
        const gDist = Math.sqrt(gDistSq) + 0.01;
        
        if (isClosed) {
             // Attraction to center (black hole)
             const force = 10.0 / gDist; 
             fx -= gdx * force;
             fy -= gdy * force;
             fz -= gdz * force;
        }
        
        if (isOpen) {
             // Repulsion from center (explosion)
            const force = 20.0 / (gDist + 0.1);
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
