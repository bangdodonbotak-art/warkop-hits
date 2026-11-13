"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Jangkar visual 3D chapter Menu — gelas Es Kopi Susu Gula Aren.
 * Canvas R3F hanya di desktop + tanpa reduced-motion + WebGL tersedia.
 * Selain itu: render 3D yang sudah ada, dengan tilt CSS. Halaman tidak
 * boleh blank — kalau canvas gagal (apa pun alasannya), tampil gambar.
 */
const CoffeeGlass3D = dynamic(() => import("./CoffeeGlass3D"), {
  ssr: false,
});

class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }
  componentDidCatch(): void {
    /* Sengaja diam — fallback gambar yang bicara. */
  }
  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
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

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setMode(!reduced && desktop && webglAvailable() ? "canvas" : "image");
  }, []);

  if (mode === "image") {
    return (
      <div>
        <FallbackImage />
        <p className="mt-3 text-center text-sm text-ink/60">
          Render 3D Es Kopi Susu Gula Aren — hero-nya Warkop Hits.
        </p>
      </div>
    );
  }

  if (mode === "loading") {
    return (
      <div
        aria-hidden="true"
        className="h-[340px] w-full animate-pulse rounded-3xl bg-ink/5 sm:h-[400px]"
      />
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
        <CanvasErrorBoundary fallback={<FallbackImage />}>
          <CoffeeGlass3D />
        </CanvasErrorBoundary>
      </div>
      <p className="mt-3 text-center text-sm text-ink/60">
        Gelas 3D Es Kopi Susu Gula Aren — muter pelan, gerakin mouse di
        atasnya.
      </p>
    </div>
  );
}
