"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * AmbientGlow — background hidup per chapter.
 *
 * Bukan partikel/debu/asap (itu dipotong di blueprint §6 — kesepakatan
 * ensemble review): ini 3 gelembung cahaya besar dan lembut yang melayang
 * pelan, seperti lampu kios dan glow senja di foto hero. Warna dikunci ke
 * token: oranye #E85D1F, kayu #8A5A33, krem #F5EDE3 (+ amber turunan).
 *
 * Gerak: rAF (bukan keyframes CSS — browser headless VM terbukti membekukan
 * animasi CSS, tapi rAF jalan; pola yang sama dipakai slideshow hero).
 * - Drift Lissajous per blob, periode 44–71 detik — sangat pelan, tenang.
 * - Parallax scroll: seluruh lapisan bergeser ±18px mengikuti posisi
 *   chapter di viewport — cahaya "jalan" bareng scroll.
 * - prefers-reduced-motion: diam di posisi awal (statis).
 * - IntersectionObserver: loop berhenti saat chapter di luar layar.
 * - Hanya transform/opacity yang dianimasikan (tanpa filter: blur —
 *   radial-gradient sudah lembut sendiri), jadi murah di HP.
 */
type Tone = "night" | "cream";

type BlobSpec = {
  size: number;
  left: string;
  top: string;
  rgb: string;
  opacity: number;
  ampX: number;
  ampY: number;
  period: number;
  phase: number;
};

const NIGHT_BLOBS: BlobSpec[] = [
  { size: 560, left: "8%", top: "10%", rgb: "232,93,31", opacity: 0.38, ampX: 70, ampY: 46, period: 52, phase: 0 },
  { size: 680, left: "56%", top: "46%", rgb: "201,123,45", opacity: 0.3, ampX: 90, ampY: 60, period: 67, phase: 1.7 },
  { size: 440, left: "70%", top: "2%", rgb: "245,237,227", opacity: 0.16, ampX: 56, ampY: 40, period: 44, phase: 3.1 },
];

const CREAM_BLOBS: BlobSpec[] = [
  { size: 520, left: "6%", top: "6%", rgb: "232,93,31", opacity: 0.1, ampX: 64, ampY: 40, period: 58, phase: 0.6 },
  { size: 620, left: "58%", top: "40%", rgb: "217,160,91", opacity: 0.14, ampX: 84, ampY: 52, period: 71, phase: 2.2 },
  { size: 420, left: "72%", top: "0%", rgb: "255,255,255", opacity: 0.3, ampX: 48, ampY: 36, period: 47, phase: 4.0 },
];

// Grain film statis (SVG noise) — tekstur foto, tanpa animasi.
const GRAIN_BG =
  "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\"/><feColorMatrix type=\"saturate\" values=\"0\"/></filter><rect width=\"160\" height=\"160\" filter=\"url(%23n)\" opacity=\"0.5\"/></svg>')";

export default function AmbientGlow({ tone }: { tone: Tone }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blobs = tone === "night" ? NIGHT_BLOBS : CREAM_BLOBS;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const layer = layerRef.current;
    if (!layer) return;
    const parent = layer.parentElement;
    if (!parent) return;

    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "200px" },
    );
    io.observe(layer);

    let top = 0;
    let height = 1;
    const measure = () => {
      const rect = parent.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = parent.offsetHeight || 1;
    };
    measure();
    window.addEventListener("resize", measure);

    const t0 = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = (now - t0) / 1000;
      blobs.forEach((b, i) => {
        const el = blobRefs.current[i];
        if (!el) return;
        const x = Math.sin((t / b.period) * Math.PI * 2 + b.phase) * b.ampX;
        const y = Math.cos((t / (b.period * 1.3)) * Math.PI * 2 + b.phase) * b.ampY;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      const vh = window.innerHeight;
      const progress = (window.scrollY + vh / 2 - top) / height;
      const par = (progress - 0.5) * 36;
      layer.style.transform = `translate3d(0, ${par.toFixed(1)}px, 0)`;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [tone]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute -inset-12 overflow-hidden"
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            blobRefs.current[i] = el;
          }}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            marginLeft: -b.size / 2,
            marginTop: -b.size / 2,
            background: `radial-gradient(circle, rgba(${b.rgb},${b.opacity}) 0%, rgba(${b.rgb},${(b.opacity * 0.55).toFixed(2)}) 45%, rgba(${b.rgb},0) 70%)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN_BG,
          opacity: tone === "night" ? 0.05 : 0.04,
        }}
      />
    </div>
  );
}
