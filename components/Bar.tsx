"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

/** Chapter 3 — Bar. Barista tuang kopi susu, diseduh per order. */
export default function Bar() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-bar-reveal]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
      aria-label="Bar — diseduh di depan mata"
      className="relative overflow-hidden py-20 text-cream"
    >
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-2">
        <div data-bar-reveal className="overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/barista.webp"
            alt="Barista menuang kopi susu ke gelas es"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h2 data-bar-reveal className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Diseduh di depan mata.
          </h2>
          <p data-bar-reveal className="mt-4 text-base leading-relaxed text-cream/75 sm:text-lg">
            Kopi diseduh per order — bukan stok cairan yang didiemin. Gula
            aren, susu, es: diseduh pas lo pesan, dituang pas masih hangat
            ketemu es.
          </p>
          <p data-bar-reveal className="mt-4 text-base leading-relaxed text-cream/75 sm:text-lg">
            Sambil nunggu, lo bisa lihat langsung bar-nya dari meja. Tidak ada
            dapur tertutup di Warkop Hits.
          </p>
        </div>
      </div>
    </section>
  );
}
