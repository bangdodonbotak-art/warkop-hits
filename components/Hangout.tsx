"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import AmbientGlow from "@/components/AmbientGlow";

/** Chapter 5 — Nongkrong. Meja buat nugas, kursi buat ngobrol. */
export default function Hangout() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hangout-reveal]",
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
      id="nongkrong"
      aria-label="Nongkrong"
      className="relative mx-auto max-w-5xl scroll-mt-24 overflow-hidden px-5 pb-20"
    >
      <AmbientGlow tone="cream" />
      <div className="relative grid items-start gap-10 md:grid-cols-2">
        <div data-hangout-reveal>
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Meja buat nugas,
            <br />
            kursi buat ngobrol.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
            Dua meja kayu, enam kursi, lorong tengah yang lapang. Laptop
            dibuka, Indomie datang, es kopi dipegang — malam jalan terus
            sampai subuh.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
            Datang sendiri boleh, berdua lebih rame. Yang penting jangan
            pulang lapar.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
            Buka 24 jam, jadi jam dua pagi pun masih ada yang nugas di sini.
            Meja yang sama, kopi yang sama — makin malam, makin rame.
          </p>
        </div>
        <div className="space-y-6">
          <div data-hangout-reveal className="overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/detail-nongkrong.webp"
              alt="Tangan memegang es kopi, mangkuk Indomie dan laptop di meja kayu"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div data-hangout-reveal className="overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/vertikal-makanan.webp"
              alt="Es kopi, Indomie, dan gorengan dari dekat di atas meja kayu"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
