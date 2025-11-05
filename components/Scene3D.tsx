'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function MorphingShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // Create gradient colors
  const colors = useMemo(() => {
    return [
      new THREE.Color('#00d9ff'), // electric cyan
      new THREE.Color('#8b3dff'), // deep purple
    ];
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();

    // Smooth rotation
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
    meshRef.current.rotation.y = time * 0.15;

    // Color transition
    const colorMix = (Math.sin(time * 0.3) + 1) / 2;
    const currentColor = colors[0].clone().lerp(colors[1], colorMix);
    materialRef.current.color = currentColor;

    // Scale breathing effect
    const scale = 1 + Math.sin(time * 0.5) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[2, 4]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#00d9ff"
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

function WireframeShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = -time * 0.1;
    meshRef.current.rotation.x = Math.cos(time * 0.15) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.3, 1]} />
      <meshBasicMaterial color="#00d9ff" wireframe opacity={0.2} transparent />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b3dff" />
          <MorphingShape />
          <WireframeShape />
        </Suspense>
      </Canvas>
    </div>
  );
}
