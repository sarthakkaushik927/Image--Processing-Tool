import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveSphere({ mouse }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Constant rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;

      // Mouse interaction
      const targetX = mouse.current[0] * 3; 
      const targetY = mouse.current[1] * 3; 
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
      <Sphere args={[1, 100, 200]} scale={2.8} ref={meshRef}>
        <MeshDistortMaterial
          color="#7c3aed" // Violet
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

export default function Hero3DBackground() {
  const mouse = useRef([0, 0]);

  return (
    <div 
      className="fixed inset-0 z-0 w-full h-full bg-black"
      onMouseMove={(e) => {
        mouse.current = [
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        ];
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#d946ef" />
        <InteractiveSphere mouse={mouse} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}