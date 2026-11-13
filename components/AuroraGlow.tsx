"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * AuroraGlow — background dinamis Warkop Hits.
 *
 * Diadaptasi dari "Aurora Background" by pulkitxm (21st.dev, id 18263),
 * dipilih Dony 13 Nov 22:09 WIB ("Aurora ember aja") karena glow buatan
 * sendiri (AmbientGlow) geraknya terlalu pelan sampai kelihatan statis.
 * Ditulis ulang ke token proyek (oranye #E85D1F, ink #17120E, krem
 * #F5EDE3) dan ditambah yang tidak ada di aslinya:
 * - `tone`: "night" (ember, buat chapter gelap + headline hero) dan
 *   "cream" (wash hangat sangat tipis, buat chapter terang — teks ink
 *   tetap kebaca).
 * - prefers-reduced-motion: satu frame statis, tanpa loop.
 * - Loop rAF BERHENTI saat section di luar layar (start/stop lewat
 *   IntersectionObserver) — 7 canvas aurora di satu halaman, hemat
 *   baterai HP. Ukuran canvas di-cache (tanpa layout read per frame),
 *   ResizeObserver ganti window resize.
 * - DPR dibatasi 1.5 supaya glow tetap halus di HP tanpa kerja berat.
 * - Tanpa dependensi baru (helper `cn` shadcn diganti string biasa).
 * - Canvas pointer-events-none + aria-hidden (dekoratif saja).
 *
 * Gerak: blob radial-gradient mengorbit (canvas 2D, rAF) — satu putaran
 * ~10 detik pada speed 1, JELAS kelihatan mata (bukan drift 44–71 detik
 * seperti AmbientGlow). Waktu diakumulasi dari performance.now() (bukan
 * timestamp rAF — browser headless VM memanggil rAF tanpa argumen —
 * dan bukan per-frame mentah, supaya kecepatan sama di layar 60Hz
 * maupun 120Hz). Review TokenHarbor DeepSeek 13 Nov 22:13 WIB:
 * screen-blend hanya di dalam canvas (tidak mengotori bg krem),
 * setTransform setelah set width sudah benar, cleanup IO sudah ada.
 */
type Tone = "night" | "cream";

type AuroraGlowProps = {
  tone: Tone;
  className?: string;
  childrenClassName?: string;
  speed?: number;
  blobCount?: number;
  children?: React.ReactNode;
};

// Warna token Warkop sebagai hsla: oranye #E85D1F ~ hsl(19, 82%, 51%).
const PALETTES: Record<Tone, [string, string, string][]> = {
  night: [
    ["hsla(19, 82%, 51%, 0.55)", "hsla(0, 84%, 50%, 0.3)", "transparent"],
    ["hsla(32, 75%, 55%, 0.45)", "transparent", "transparent"],
  ],
  cream: [
    ["hsla(19, 82%, 55%, 0.2)", "hsla(32, 70%, 60%, 0.12)", "transparent"],
    ["hsla(45, 80%, 70%, 0.16)", "transparent", "transparent"],
  ],
};

export default function AuroraGlow({
  tone,
  className = "",
  childrenClassName = "",
  speed = 1,
  blobCount = 4,
  children,
}: AuroraGlowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = PALETTES[tone];
    const reduced = prefersReducedMotion();
    let cw = 0;
    let ch = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (t: number) => {
      const w = cw;
      const h = ch;
      if (!w || !h) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < blobCount; i++) {
        const layer = palette[i % palette.length];
        if (!layer) continue;
        const [c1, c2, c3] = layer;
        const phase = (i / blobCount) * Math.PI * 2 + t;
        const x = w / 2 + Math.sin(phase) * (w * 0.2) + Math.cos(t * 0.5) * (w * 0.1);
        const y = h / 2 + Math.cos(phase * 0.7) * (h * 0.2) + Math.sin(t * 0.3) * (h * 0.1);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.4);
        gradient.addColorStop(0, c1 ?? "transparent");
        gradient.addColorStop(0.5, c2 ?? "transparent");
        gradient.addColorStop(1, c3 ?? "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < Math.min(2, palette.length); i++) {
        const layer = palette[i];
        if (!layer) continue;
        const phase = (i / 2) * Math.PI + t * 0.8;
        const x = w / 2 + Math.sin(phase * 1.2) * (w * 0.15);
        const y = h / 2 + Math.cos(phase * 0.9) * (h * 0.15);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.35);
        gradient.addColorStop(0, layer[0] ?? "transparent");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(1.2);
    });
    ro.observe(canvas);

    // Reduced motion: satu frame statis di posisi tengah orbit.
    if (reduced) {
      draw(1.2);
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = 0;
    let running = false;
    // Durasi satu frame pada 60fps — dipakai menormalkan laju animasi
    // supaya sama di layar 60Hz maupun 120Hz.
    const FRAME_MS = 1000 / 60;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (last) {
        timeRef.current += 0.01 * speed * Math.min((now - last) / FRAME_MS, 3);
      }
      last = now;
      draw(timeRef.current);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      },
      { rootMargin: "200px" },
    );
    io.observe(wrap);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, [tone, speed, blobCount]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      />
      {children ? <div className={`relative ${childrenClassName}`}>{children}</div> : null}
    </div>
  );
}
