"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Gelas Es Kopi Susu Gula Aren — 2.5D FOTO (rebuild 13 Nov 2026, cara Dony).
 * Versi primitif R3F dinilai Dony "gagal, ga realistis", versi transmission
 * dinilai ~6/10. Arahan Dony 20:46 WIB: pakai FOTO minuman yg sudah dibuat,
 * remove background, convert jadi 3D. Jadi: foto es kopi susu terbaik
 * (render 3D fotorealistis, background krem polos) di-remove background-nya
 * (PIL + numpy + scipy, tanpa model AI) jadi cutout transparan, lalu
 * cutout itu jadi objek di scene 3D — berdiri di atas meja kayu, di depan
 * backdrop malam, goyang pelan + parallax kamera. Fotonya yg bawa
 * realisme (es batu asli, kondensasi, lapisan gula aren/kopi/susu,
 * sedotan hitam); scene 3D yg bawa gerak. Kalau ini masih gagal, 3D dihapus.
 * Gelas tetap berdiri DI ATAS meja, bukan melayang.
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

// ---------- gelas foto (cutout) — 2.5D ----------

// Cutout: public/assets/es-kopi-susu-cutout.webp, 827x1255 piksel,
// dasar gelas 17px di atas bawah crop. Plane 1.95 x 2.9, pivot di dasar
// gelas (y=-1.2, di atas meja), goyang pelan mengelilingi sumbu dasar.
const PLANE_W = 1.95;
const PLANE_H = 2.9;
const PLANE_Y = 1.41;

function PhotoCup() {
  const sway = useRef<THREE.Group>(null);
  const tex = useLoader(
    THREE.TextureLoader,
    "/assets/es-kopi-susu-cutout.webp",
  );
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }, [tex]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sway.current) {
      sway.current.rotation.y = Math.sin(t * 0.3) * 0.14;
      sway.current.rotation.x = Math.sin(t * 0.23) * 0.03;
    }
  });

  return (
    <group ref={sway} position={[0, -1.2, 0]}>
      <mesh position={[0, PLANE_Y, 0]}>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <meshBasicMaterial
          map={tex}
          transparent
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
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
      <Suspense fallback={null}>
        <PhotoCup />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
