"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

function AnimatedOrb() {
  const sphereRef = useRef<any>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={sphereRef} args={[1.5, 64, 64]} scale={2.2}>
        <MeshDistortMaterial
          color="#ffffff"
          attach="material"
          distort={0.5}
          speed={1.5}
          roughness={0.1}
          metalness={0.1}
        />
      </Sphere>
    </Float>
  );
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={3} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={5} color="#0ea5e9" />
        <directionalLight position={[-10, -10, -5]} intensity={4} color="#f43f5e" />
        <AnimatedOrb />
      </Canvas>
    </div>
  );
}
