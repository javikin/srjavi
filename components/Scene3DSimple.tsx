'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Rotación suave
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;

    // Cambio de color
    const color = new THREE.Color();
    color.setHSL((time * 0.05) % 1, 0.7, 0.6);
    (meshRef.current.material as THREE.MeshStandardMaterial).color = color;

    // Respiración
    const scale = 1 + Math.sin(time * 0.5) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshStandardMaterial
        color="#00d9ff"
        roughness={0.3}
        metalness={0.7}
        wireframe={false}
      />
    </mesh>
  );
}

function Wireframe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = -state.clock.getElapsedTime() * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.3, 0]} />
      <meshBasicMaterial color="#00d9ff" wireframe opacity={0.2} transparent />
    </mesh>
  );
}

export default function Scene3DSimple() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b3dff" />
          <RotatingIcosahedron />
          <Wireframe />
        </Suspense>
      </Canvas>
    </div>
  );
}
