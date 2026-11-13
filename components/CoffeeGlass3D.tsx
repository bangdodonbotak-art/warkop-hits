"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Gelas Es Kopi Susu Gula Aren 3D — dibangun dari primitif Three.js.
 * Lapisan: gula aren (bawah, gelap) → kopi → susu (atas, krem),
 * es batu, sedotan oranye, tatakan kayu. Showcase saja, bukan pemesanan.
 *
 * Backdrop (instruksi Dony 13 Nov 18:20 WIB — "3D nya jangan polos"):
 * tema "Satu Malam Nongkrong" — latar ink, glow oranye, meja kayu,
 * bokeh lampu string. Gelas berdiri DI ATAS meja, bukan melayang.
 * Murah: plane + lampu + titik bokeh saja, tanpa tekstur/partikel.
 */

/** Titik bokeh lampu string — [x, y, z, ukuran, warna]. */
const BOKEH: Array<[number, number, number, number, string]> = [
  [-2.6, 2.1, -2.5, 0.09, "#ffb347"],
  [-1.8, 1.85, -2.8, 0.06, "#f5ede3"],
  [-1.0, 1.7, -2.5, 0.11, "#e85d1f"],
  [-0.2, 1.65, -2.9, 0.07, "#ffb347"],
  [0.7, 1.75, -2.5, 0.1, "#f5ede3"],
  [1.5, 1.95, -2.8, 0.06, "#e85d1f"],
  [2.4, 2.2, -2.5, 0.09, "#ffb347"],
  [3.1, 2.5, -2.9, 0.05, "#f5ede3"],
];

function NightBackdrop() {
  return (
    <group>
      {/* Latar malam */}
      <color attach="background" args={["#17120e"]} />
      <fog attach="fog" args={["#17120e", 9, 16]} />
      {/* Meja kayu — gelas berdiri di atasnya */}
      <mesh position={[0, -1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#8a5a33" roughness={0.9} />
      </mesh>
      {/* Glow oranye lembut di belakang gelas (dua lapis, tanpa tekstur) */}
      <mesh position={[0, 0.6, -2.8]}>
        <circleGeometry args={[2.8, 48]} />
        <meshBasicMaterial
          color="#e85d1f"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.6, -2.7]}>
        <circleGeometry args={[1.6, 48]} />
        <meshBasicMaterial
          color="#e85d1f"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
      {/* Bokeh lampu string */}
      {BOKEH.map(([x, y, z, size, color], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[size, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}
function GlassModel() {
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.25;
    if (tilt.current) {
      tilt.current.rotation.x +=
        (state.pointer.y * -0.12 - tilt.current.rotation.x) * 0.05;
      tilt.current.rotation.y +=
        (state.pointer.x * 0.3 - tilt.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin} position={[0, -0.1, 0]}>
        {/* Tatakan kayu */}
        <mesh position={[0, -1.28, 0]}>
          <cylinderGeometry args={[1.45, 1.45, 0.09, 48]} />
          <meshStandardMaterial color="#8a5a33" roughness={0.85} />
        </mesh>
        {/* Dinding gelas bening */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.05, 0.85, 2.4, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#f5ede3"
            transparent
            opacity={0.28}
            roughness={0.08}
            metalness={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Dasar gelas */}
        <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.85, 48]} />
          <meshPhysicalMaterial
            color="#f5ede3"
            transparent
            opacity={0.35}
            roughness={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Lapisan gula aren */}
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.82, 0.78, 0.4, 48]} />
          <meshStandardMaterial color="#3a1f0d" roughness={0.3} />
        </mesh>
        {/* Lapisan kopi */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.92, 0.82, 1.2, 48]} />
          <meshStandardMaterial color="#6b3a1f" roughness={0.25} />
        </mesh>
        {/* Lapisan susu di atas */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.95, 0.92, 0.14, 48]} />
          <meshStandardMaterial color="#e8d5b5" roughness={0.4} />
        </mesh>
        {/* Es batu */}
        <mesh position={[-0.35, 0.62, 0.25]} rotation={[0.4, 0.3, 0.2]}>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
            roughness={0.15}
          />
        </mesh>
        <mesh position={[0.4, 0.58, -0.15]} rotation={[0.2, 0.7, -0.3]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
            roughness={0.15}
          />
        </mesh>
        <mesh position={[0.05, 0.72, 0.3]} rotation={[0.5, 0.1, 0.4]}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
            roughness={0.15}
          />
        </mesh>
        {/* Sedotan oranye */}
        <mesh position={[0.55, 0.9, 0.1]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.06, 0.06, 3.1, 16]} />
          <meshStandardMaterial color="#e85d1f" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

export default function CoffeeGlass3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.6, 6.4], fov: 35 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#f5ede3" />
      <pointLight position={[0, 0.5, -1.5]} intensity={6} distance={8} color="#e85d1f" />
      <NightBackdrop />
      <GlassModel />
    </Canvas>
  );
}
