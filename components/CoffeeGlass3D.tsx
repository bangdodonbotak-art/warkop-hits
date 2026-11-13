"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Gelas Es Kopi Susu Gula Aren 3D — REALISTIS (rebuild 13 Nov 2026).
 * Versi primitif sebelumnya (silinder/kotak, warna datar) dinilai Dony
 * "gagal, ga realistis" — jadi gelas dibangun ulang dengan teknik
 * product-render: profil gelas LatheGeometry, kaca transmission asli
 * (refraksi), es transparan, lapisan gula aren → kopi → susu, environment
 * map RoomEnvironment (refleksi), pencahayaan 3 titik + bayangan lembut,
 * meja kayu bertekstur prosedural + backdrop malam (gradasi + bokeh +
 * glow oranye). Semua tekstur dibuat prosedural saat runtime (canvas 2D),
 * tanpa aset eksternal. Gelas tetap berdiri DI ATAS meja, bukan melayang.
 * Gerakan: putar pelan (spin) + parallax kamera mengikuti pointer
 * (mouse / sentuhan) — gelasnya sendiri tidak miring.
 */

// ---------- tekstur prosedural (canvas 2D, dibuat saat runtime) ----------

function radialTexture(rgb: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, `rgba(${rgb},0.9)`);
  grad.addColorStop(0.4, `rgba(${rgb},0.45)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function woodTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#6e4423";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 110; i++) {
    const y = Math.random() * 512;
    const dark = Math.random() > 0.45;
    g.strokeStyle = dark
      ? `rgba(46,26,10,${0.08 + Math.random() * 0.16})`
      : `rgba(150,104,58,${0.08 + Math.random() * 0.14})`;
    g.lineWidth = 0.6 + Math.random() * 2.4;
    g.beginPath();
    g.moveTo(-10, y);
    g.bezierCurveTo(
      150,
      y + (Math.random() * 10 - 5),
      350,
      y + (Math.random() * 10 - 5),
      522,
      y + (Math.random() * 8 - 4),
    );
    g.stroke();
  }
  for (let x = 0; x <= 512; x += 128) {
    g.strokeStyle = "rgba(30,16,6,0.5)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 512);
    g.stroke();
  }
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(0,0,0,${Math.random() * 0.08})`;
    g.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function backdropTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#060302");
  grad.addColorStop(0.45, "#140d07");
  grad.addColorStop(0.75, "#241610");
  grad.addColorStop(1, "#1a0f08");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- environment map lokal (tanpa unduh HDR eksternal) ----------

function SceneEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      envTex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

// ---------- backdrop malam: gradasi + glow + bokeh ----------

const BOKEH: Array<[number, number, number, number, string, number]> = [
  [-2.8, 2.3, -3.2, 0.55, "#ffb347", 0.85],
  [-1.9, 1.9, -3.5, 0.35, "#f5ede3", 0.7],
  [-1.0, 2.0, -3.0, 0.6, "#e85d1f", 0.8],
  [-0.1, 1.8, -3.6, 0.4, "#ffb347", 0.75],
  [0.8, 2.1, -3.1, 0.5, "#f5ede3", 0.7],
  [1.7, 2.4, -3.4, 0.35, "#e85d1f", 0.8],
  [2.6, 2.2, -3.0, 0.55, "#ffb347", 0.85],
  [3.2, 2.6, -3.5, 0.3, "#f5ede3", 0.6],
  [-3.4, 1.6, -3.0, 0.4, "#e85d1f", 0.6],
];

function NightBackdrop() {
  const glowTex = useMemo(() => radialTexture("255,255,255"), []);
  const bgTex = useMemo(() => backdropTexture(), []);
  return (
    <group>
      <mesh position={[0, 2, -4.5]}>
        <planeGeometry args={[34, 20]} />
        <meshBasicMaterial map={bgTex} toneMapped={false} fog={false} />
      </mesh>
      <sprite position={[0, 0.8, -3.8]} scale={[7, 5, 1]}>
        <spriteMaterial
          map={glowTex}
          color="#e85d1f"
          transparent
          opacity={0.32}
          depthWrite={false}
          fog={false}
        />
      </sprite>
      <sprite position={[0, 0.6, -3.7]} scale={[3.2, 2.6, 1]}>
        <spriteMaterial
          map={glowTex}
          color="#ff9a3d"
          transparent
          opacity={0.4}
          depthWrite={false}
          fog={false}
        />
      </sprite>
      {BOKEH.map(([x, y, z, size, color, opacity], i) => (
        <sprite key={i} position={[x, y, z]} scale={[size, size, 1]}>
          <spriteMaterial
            map={glowTex}
            color={color}
            transparent
            opacity={opacity}
            depthWrite={false}
            fog={false}
          />
        </sprite>
      ))}
    </group>
  );
}

// ---------- meja kayu + bayangan kontak ----------

function WoodTable() {
  const woodTex = useMemo(() => woodTexture(), []);
  const blobTex = useMemo(() => radialTexture("0,0,0"), []);
  return (
    <group>
      <mesh
        position={[0, -1.22, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          map={woodTex}
          roughness={0.7}
          metalness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, -1.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial
          map={blobTex}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ---------- gelas: profil lathe + kaca transmission + isi ----------

// Profil gelas (x = radius, y = tinggi): dinding luar naik, lewat bibir,
// dinding dalam turun, alas dalam — dinding punya ketebalan.
const CUP_PROFILE: Array<[number, number]> = [
  [0.0, -1.2],
  [0.55, -1.2],
  [0.72, -1.18],
  [0.78, -1.05],
  [0.84, -0.5],
  [0.9, 0.0],
  [0.96, 0.6],
  [1.0, 1.05],
  [1.03, 1.16],
  [1.04, 1.22],
  [1.0, 1.24],
  [0.96, 1.2],
  [0.93, 0.6],
  [0.87, 0.0],
  [0.81, -0.5],
  [0.76, -0.95],
  [0.6, -1.04],
  [0.0, -1.04],
];

const ICE: Array<[[number, number, number], [number, number, number], number]> = [
  [[-0.28, 0.85, 0.15], [0.4, 0.3, 0.2], 0.46],
  [[0.3, 0.8, -0.12], [0.2, 0.7, -0.3], 0.44],
  [[0.0, 0.95, 0.22], [0.5, 0.1, 0.4], 0.42],
];

function GlassModel() {
  const spin = useRef<THREE.Group>(null);
  const cupPoints = useMemo(
    () => CUP_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={spin} position={[0, -0.1, 0]}>
      {/* Dinding gelas — kaca transmission asli (refraksi) */}
      <mesh>
        <latheGeometry args={[cupPoints, 64]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.18}
          roughness={0.06}
          ior={1.5}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
          specularIntensity={1}
          envMapIntensity={1.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Lapisan gula aren (bawah, gelap) */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.78, 0.72, 0.45, 48]} />
        <meshStandardMaterial color="#2a1408" roughness={0.25} />
      </mesh>
      {/* Lapisan kopi */}
      <mesh position={[0, 0.0, 0]}>
        <cylinderGeometry args={[0.9, 0.78, 1.15, 48]} />
        <meshStandardMaterial color="#5a2e14" roughness={0.2} />
      </mesh>
      {/* Lapisan susu di atas */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.92, 0.9, 0.16, 48]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.35} />
      </mesh>
      {/* Es batu — transparan (bukan transmission, supaya tetap terlihat
          lewat dinding kaca), putih kebiruan */}
      {ICE.map(([pos, rot, size], i) => (
        <mesh key={i} position={pos} rotation={rot} castShadow>
          <boxGeometry args={[size, size, size]} />
          <meshPhysicalMaterial
            color="#eaf6ff"
            transparent
            opacity={0.65}
            roughness={0.12}
            clearcoat={0.6}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
      {/* Sedotan oranye */}
      <mesh
        position={[0.58, 1.15, 0.05]}
        rotation={[0, 0, -0.2]}
        castShadow
      >
        <cylinderGeometry args={[0.06, 0.06, 2.4, 16]} />
        <meshStandardMaterial color="#e85d1f" roughness={0.3} />
      </mesh>
    </group>
  );
}

// ---------- parallax kamera (bukan gelas yang miring) ----------

function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (0.5 + pointer.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

export default function CoffeeGlass3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.5, 6.6], fov: 30 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <SceneEnvironment />
      <color attach="background" args={["#0d0805"]} />
      <fog attach="fog" args={["#0d0805", 10, 18]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.0}
        color="#fff1dd"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-5, 3, -2]} intensity={0.7} color="#ffd9a0" />
      <pointLight
        position={[0, 0.6, -2.2]}
        intensity={10}
        distance={10}
        color="#e85d1f"
      />
      <NightBackdrop />
      <WoodTable />
      <GlassModel />
      <CameraRig />
    </Canvas>
  );
}
