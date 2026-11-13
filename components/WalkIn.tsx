"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import AuroraGlow from "@/components/AuroraGlow";

/**
 * Chapter 2 — Jalan Masuk. Scrub VERTIKAL: scroll = kamera maju ke dalam kios.
 * Foto di-zoom pelan seiring scroll (scale 1.25 → 1). Tanpa horizontal scroll.
 */
export default function WalkIn() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-walkin-img]",
        { scale: 1.22 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imgWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        "[data-walkin-text]",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-walkin-text]",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Jalan masuk ke kios"
      className="relative mx-auto max-w-5xl overflow-hidden px-5 pb-20"
    >
      <AuroraGlow tone="cream" className="absolute inset-0" />
      <div
        ref={imgWrapRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-ink sm:aspect-[16/9]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-walkin-img
          src="/assets/jalan-masuk.webp"
          alt="Pintu kios terbuka — lorong tengah menuju bar, dua meja di kiri kanan"
          className="hidden h-full w-full object-cover sm:block"
          loading="lazy"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-walkin-img
          src="/assets/interior-vertikal.webp"
          alt="Interior kios malam hari — mahasiswa nugas di meja kiri kanan"
          className="block h-full w-full object-cover sm:hidden"
          loading="lazy"
        />
      </div>
      <div data-walkin-text className="relative mt-8 max-w-2xl">
        <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          Pintu selalu terbuka.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink/70 sm:text-lg">
          Kios 3x3 satu lantai, depan terbuka penuh tanpa pintu. Lorong tengah
          kosong buat jalan masuk, dua meja nempel di dinding kiri kanan.
          Masuk, duduk, pesan — sesimpel itu.
        </p>
      </div>
    </section>
  );
}
