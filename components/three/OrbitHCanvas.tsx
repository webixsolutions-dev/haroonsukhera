"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

export function OrbitHMesh({ targetRotation = 0 }: { targetRotation?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const orbiterRef = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth transition to target rotation
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotation + state.pointer.x * 0.15,
      4,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.15,
      4,
      delta
    );

    // Idle floating
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;

    // Orbiting molten sphere
    if (orbiterRef.current) {
      const angle = state.clock.elapsedTime * 1.5;
      orbiterRef.current.position.x = Math.cos(angle) * 1.7;
      orbiterRef.current.position.y = Math.sin(angle) * 1.7;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Titanium Left Pillar */}
      <mesh position={[-0.7, 0, 0]}>
        <boxGeometry args={[0.35, 2.2, 0.35]} />
        <meshPhysicalMaterial
          color="#B0B5C0"
          metalness={0.95}
          roughness={0.25}
          clearcoat={0.3}
        />
      </mesh>

      {/* Titanium Right Pillar */}
      <mesh position={[0.7, 0, 0]}>
        <boxGeometry args={[0.35, 2.2, 0.35]} />
        <meshPhysicalMaterial
          color="#B0B5C0"
          metalness={0.95}
          roughness={0.25}
          clearcoat={0.3}
        />
      </mesh>

      {/* Glass Crossbar with Molten Emissive Core */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 0.28, 0.28]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.92}
          opacity={1}
          transparent
          roughness={0.1}
          ior={1.45}
          thickness={0.6}
        />
      </mesh>
      {/* Inner molten core */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.14, 0.14]} />
        <meshBasicMaterial color="#FF5A1F" />
      </mesh>

      {/* Glass Torus Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.7, 0.035, 32, 100]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.95}
          transparent
          roughness={0.15}
          ior={1.45}
        />
      </mesh>

      {/* Orbiting Molten Sphere */}
      <mesh ref={orbiterRef} position={[1.7, 0, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color="#FF5A1F"
          emissive="#FF5A1F"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Molten Accent Point Light */}
      <pointLight color="#FF5A1F" intensity={3.5} distance={6} position={[1.5, 1, 1]} />
      <pointLight color="#FFFFFF" intensity={1.5} distance={8} position={[-2, 2, 3]} />
    </group>
  );
}

export default function OrbitHCanvas({ targetRotation = 0 }: { targetRotation?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-5, -4, -5]} intensity={0.4} color="#FF5A1F" />
      <Environment preset="studio" />
      <OrbitHMesh targetRotation={targetRotation} />
    </Canvas>
  );
}
