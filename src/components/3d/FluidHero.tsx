'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Environment } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly interpolate rotation based on mouse position
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.5, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.5, 0.1);
    }

    if (materialRef.current) {
      // Smoothly interpolate material properties
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        hovered ? 0.6 : 0.3,
        delta * 2
      );
      materialRef.current.speed = THREE.MathUtils.lerp(
        materialRef.current.speed,
        hovered ? 3 : 1.5,
        delta * 2
      );
      
      // Color interpolation
      const targetColor = new THREE.Color(hovered ? '#a855f7' : '#3b82f6');
      materialRef.current.color.lerp(targetColor, delta * 2);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} ref={meshRef} scale={2.5} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#3b82f6"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function FluidHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 md:text-8xl">
            Mohammed Fawaz
          </h1>
          <p className="mt-4 text-xl font-light text-zinc-300 md:text-2xl">
            Full Stack Developer
          </p>
        </motion.div>
      </div>
    </div>
  );
}
