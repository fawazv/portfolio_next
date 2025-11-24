'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function DistortedMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        hovered ? 0.8 : 0.4,
        delta * 3
      );
      materialRef.current.speed = THREE.MathUtils.lerp(
        materialRef.current.speed,
        hovered ? 4 : 2,
        delta * 3
      );
      
      const targetColor = new THREE.Color(hovered ? '#a855f7' : '#06b6d4'); // Purple to Cyan
      materialRef.current.color.lerp(targetColor, delta * 3);
    }
    
    if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1, 100, 100]} ref={meshRef} scale={2.2} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#06b6d4"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

export default function InteractiveShape() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <DistortedMesh />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
