"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Jangkar visual 3D chapter Menu — gelas Es Kopi Susu Gula Aren.
 * Canvas R3F hanya di desktop + tanpa reduced-motion + WebGL tersedia.
 * Selain itu: render 3D yang sudah ada, dengan tilt CSS. Halaman tidak
 * boleh blank — kalau canvas gagal (apa pun alasannya), tampil gambar.
 *
 * DIAGNOSTIK SEMENTARA (13 Nov 2026): ?debug3d=1 di URL menampilkan info
 * gate + pesan error runtime di DOM (data-3d-debug / data-3d-error),
 * karena canvas tidak pernah mount di browser live dan error boundary
 * selama ini menelan error-nya diam-diam. Hapus blok debug ini setelah
 * root cause ketemu.
 */
function debug3dEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).has("debug3d");
  } catch {
    return false;
  }
}
const CoffeeGlass3D = dynamic(() => import("./CoffeeGlass3D"), {
  ssr: false,
});

class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode; debug: boolean },
  { failed: boolean; error: Error | null }
> {
  constructor(props: {
    fallback: ReactNode;
    children: ReactNode;
    debug: boolean;
  }) {
    super(props);
    this.state = { failed: false, error: null };
  }
  static getDerivedStateFromError(error: Error): {
    failed: boolean;
    error: Error;
  } {
    return { failed: true, error };
  }
  componentDidCatch(error: Error): void {
    if (typeof window !== "undefined") {
      (window as unknown as { __warkop3dError?: string }).__warkop3dError =
        `${error.name}: ${error.message}`;
    }
  }
  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <>
        {this.props.fallback}
        {this.props.debug && this.state.error ? (
          <p data-3d-error className="mt-2 text-xs break-words text-red-500">
            3D error: {this.state.error.name}: {this.state.error.message}
          </p>
        ) : null}
      </>
    );
  }
}

function webglAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function FallbackImage() {
  return (
    <figure
      data-3d-fallback
      className="overflow-hidden rounded-3xl bg-ink"
      style={{
        transform: "perspective(900px) rotateY(-6deg)",
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(232,93,31,0.35), #17120e 70%)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/media-generation-3d-es-kopi-susu-malam-0-aef64112-df3b-4e43-99b2-84744c4b7e0b.webp"
        alt="Render 3D Es Kopi Susu Gula Aren berlatar malam — gelas di atas meja kayu, bokeh lampu string"
        className="aspect-[3/2] w-full object-cover transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]"
        loading="lazy"
      />
    </figure>
  );
}

export default function CoffeeGlassShowcase() {
  const [mode, setMode] = useState<"loading" | "canvas" | "image">("loading");
  const [gate, setGate] = useState<string>("pending");
  const [debug, setDebug] = useState<boolean>(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const webgl = webglAvailable();
    setGate(
      `reduced=${reduced} desktop=${desktop} webgl=${webgl} w=${window.innerWidth}`,
    );
    setDebug(debug3dEnabled());
    setMode(!reduced && desktop && webgl ? "canvas" : "image");
  }, []);

  if (mode === "image") {
    return (
      <div>
        <FallbackImage />
        <p className="mt-3 text-center text-sm text-ink/60">
          Render 3D Es Kopi Susu Gula Aren — hero-nya Warkop Hits.
        </p>
        {debug ? (
          <p
            data-3d-debug
            className="mt-2 text-center text-xs break-words"
          >
            3D debug: mode=image gate[{gate}]
          </p>
        ) : null}
      </div>
    );
  }

  if (mode === "loading") {
    return (
      <div>
        <div
          aria-hidden="true"
          className="h-[340px] w-full animate-pulse rounded-3xl bg-ink/5 sm:h-[400px]"
        />
        {debug ? (
          <p
            data-3d-debug
            className="mt-2 text-center text-xs break-words"
          >
            3D debug: mode=loading gate[{gate}]
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <div
        data-3d-canvas
        role="img"
        aria-label="Gelas Es Kopi Susu Gula Aren 3D — muter pelan, ikuti mouse. Showcase saja, bukan pemesanan."
        className="relative h-[340px] w-full overflow-hidden rounded-3xl bg-ink sm:h-[400px]"
      >
        <CanvasErrorBoundary fallback={<FallbackImage />} debug={debug}>
          <CoffeeGlass3D />
        </CanvasErrorBoundary>
      </div>
      <p className="mt-3 text-center text-sm text-ink/60">
        Gelas 3D Es Kopi Susu Gula Aren — muter pelan, gerakin mouse di
        atasnya.
      </p>
      {debug ? (
        <p data-3d-debug className="mt-2 text-center text-xs break-words">
          3D debug: mode=canvas gate[{gate}]
        </p>
      ) : null}
    </div>
  );
}
