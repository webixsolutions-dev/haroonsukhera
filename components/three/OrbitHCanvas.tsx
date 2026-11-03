"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

export function OrbitHMesh({ targetRotation = 0 }: { targetRotation?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const orbiterRef = useRef<THREE.Mesh>(null);
  const orbiterGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth transition to target rotation + subtle pointer parallax
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotation + state.pointer.x * 0.22,
      3.5,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.16,
      3.5,
      delta
    );

    // Subtle counter-rotation of rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = state.clock.elapsedTime * 0.18;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -state.clock.elapsedTime * 0.12;
    }

    // Orbiting molten sphere along tilted trajectory
    if (orbiterRef.current) {
      const angle = state.clock.elapsedTime * 1.15;
      const rx = Math.cos(angle) * 1.78;
      const ry = Math.sin(angle) * 1.12;
      const rz = Math.sin(angle) * 0.95;
      orbiterRef.current.position.set(rx, ry, rz);
      if (orbiterGlowRef.current) {
        orbiterGlowRef.current.position.set(rx, ry, rz);
      }
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.14} floatIntensity={0.32}>
      <group ref={groupRef} dispose={null}>
        {/* Precision-milled Titanium Left Pillar */}
        <RoundedBox args={[0.42, 2.35, 0.42]} radius={0.07} smoothness={6} position={[-0.74, 0, 0]}>
          <meshPhysicalMaterial
            color="#C4C9D4"
            metalness={0.96}
            roughness={0.18}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
            reflectivity={1}
          />
        </RoundedBox>

        {/* Precision-milled Titanium Right Pillar */}
        <RoundedBox args={[0.42, 2.35, 0.42]} radius={0.07} smoothness={6} position={[0.74, 0, 0]}>
          <meshPhysicalMaterial
            color="#C4C9D4"
            metalness={0.96}
            roughness={0.18}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
            reflectivity={1}
          />
        </RoundedBox>

        {/* Optical Liquid Glass Crossbar */}
        <RoundedBox args={[1.18, 0.34, 0.34]} radius={0.06} smoothness={6} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.94}
            opacity={1}
            transparent
            roughness={0.06}
            ior={1.52}
            thickness={0.85}
            specularIntensity={1}
          />
        </RoundedBox>

        {/* Molten Emissive Filament Core */}
        <RoundedBox args={[0.98, 0.13, 0.13]} radius={0.04} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#FF5A1F"
            emissive="#FF5A1F"
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </RoundedBox>

        {/* Primary Tilted Optical Glass Ring */}
        <mesh ref={outerRingRef} rotation={[Math.PI / 2.8, 0.22, 0]}>
          <torusGeometry args={[1.78, 0.032, 32, 128]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.95}
            transparent
            roughness={0.08}
            ior={1.5}
            thickness={0.4}
          />
        </mesh>

        {/* Secondary Molten Hairline Orbit Ring */}
        <mesh ref={innerRingRef} rotation={[-Math.PI / 3.2, -0.28, 0]}>
          <torusGeometry args={[1.48, 0.012, 24, 120]} />
          <meshStandardMaterial
            color="#FF8A5C"
            emissive="#FF5A1F"
            emissiveIntensity={1.4}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Orbiting Molten Sphere */}
        <mesh ref={orbiterRef} position={[1.78, 0, 0]}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial
            color="#FF5A1F"
            emissive="#FF5A1F"
            emissiveIntensity={3.2}
            toneMapped={false}
          />
        </mesh>
        <pointLight ref={orbiterGlowRef} color="#FF5A1F" intensity={3.2} distance={4.5} />

        {/* Studio Rim & Core Lights */}
        <pointLight color="#FF5A1F" intensity={4.5} distance={6} position={[0, 0, 0.6]} />
        <pointLight color="#FFFFFF" intensity={2.2} distance={9} position={[-2.5, 2.5, 3.5]} />
      </group>
    </Float>
  );
}

export default function OrbitHCanvas({ targetRotation = 0 }: { targetRotation?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.1], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, -4, -4]} intensity={0.65} color="#FF5A1F" />
      <Environment preset="studio" />
      <OrbitHMesh targetRotation={targetRotation} />
    </Canvas>
  );
}
