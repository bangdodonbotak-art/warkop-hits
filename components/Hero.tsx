"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/lib/site-data";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Chapter 1 — Hero. Video full-bleed, headline DI BAWAH video (bukan di atasnya).
 * Pin video sebentar lalu lepas — bukan jebakan scroll.
 *
 * Hero WAJIB dinamis (instruksi Dony 13 Nov 18:22 WIB): di bawah video ada
 * slideshow Ken Burns (foto, crossfade + zoom pelan) yang DIJAMIN jalan.
 * Video 16s/10s adalah enhancement di atasnya. Kalau browser tidak bisa
 * muter mp4 (canPlayType kosong / error), video disembunyikan dan slideshow
 * yang tampil — hero tidak pernah statis. prefers-reduced-motion: video
 * pause, slideshow jadi satu foto statis.
 */
const DESKTOP_SLIDES = [
  "/assets/hero-senja.webp",
  "/assets/jalan-masuk.webp",
  "/assets/barista.webp",
  "/assets/flatlay.webp",
];
const MOBILE_SLIDES = [
  "/assets/hero-senja-vertikal.webp",
  "/assets/interior-vertikal.webp",
  "/assets/vertikal-makanan.webp",
];

/**
 * Slideshow Ken Burns — digerakkan rAF (bukan animasi CSS).
 * Alasan: browser headless di VM ini MEMBEKUKAN animasi CSS (terverifikasi
 * 13 Nov 18:xx WIB: keyframes ada di build, tapi computed animation-name
 * kosong dan transform/opacity tidak berubah selama 6+ detik — bahkan untuk
 * animasi CSS trivial di halaman tes). rAF jalan 60fps di browser yang sama
 * (183 frame / 3 detik), jadi gerak dijamin terlihat di VM maupun di browser
 * asli. Satu slide = 6 detik; fade-in ~1 detik, zoom pelan 1.14 → 1.02,
 * crossfade ~2 detik ke slide berikut. prefers-reduced-motion: satu foto
 * statis (cabang `reduced` di bawah).
 */
function Slideshow({
  images,
  reduced,
}: {
  images: string[];
  reduced: boolean;
}) {
  const refs = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    if (reduced) return;
    const cycle = images.length * 6000;
    let raf = 0;
    const start = performance.now();
    // PENTING: jangan pakai parameter timestamp rAF — browser headless di VM
    // ini memanggil callback rAF TANPA argumen (terverifikasi: `now` undefined
    // → t NaN → semua slide opacity 0). performance.now() selalu ada.
    const tick = () => {
      const t = (performance.now() - start) % cycle;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const p = ((((t - i * 6000) % cycle) + cycle) % cycle) / cycle; // 0..1
        let opacity: number;
        let scale: number;
        if (p < 0.04) {
          opacity = p / 0.04;
          scale = 1.14;
        } else if (p < 0.25) {
          opacity = 1;
          scale = 1.14 - 0.12 * ((p - 0.04) / 0.21);
        } else if (p < 0.33) {
          opacity = 1 - (p - 0.25) / 0.08;
          scale = 1.02 - 0.02 * ((p - 0.25) / 0.08);
        } else {
          opacity = 0;
          scale = 1;
        }
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `scale(${scale.toFixed(4)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [images, reduced]);

  if (reduced) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={images[0]}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <>
      {images.map((src, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ opacity: 0, transform: "scale(1.14)" }}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
    </>
  );
}

export default function Hero() {
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoMobileRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const isReduced = prefersReducedMotion();
    setReduced(isReduced);
    if (isReduced) {
      videoRef.current?.pause();
      videoMobileRef.current?.pause();
      return;
    }
    // Gate video: kalau browser tidak bisa muter mp4, sembunyikan video —
    // slideshow di bawahnya yang tampil. (Di VM ini canPlayType kosong.)
    const canPlay = (el: HTMLVideoElement | null) =>
      !!el && el.canPlayType('video/mp4; codecs="avc1.42E01E"') !== "";
    if (!canPlay(videoRef.current) && !canPlay(videoMobileRef.current)) {
      setShowVideo(false);
    }
    const onError = () => setShowVideo(false);
    videoRef.current?.addEventListener("error", onError);
    videoMobileRef.current?.addEventListener("error", onError);
    return () => {
      videoRef.current?.removeEventListener("error", onError);
      videoMobileRef.current?.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const wrap = videoWrapRef.current;
    if (!wrap) return;
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "+=25%",
      pin: true,
      pinSpacing: true,
    });
    return () => {
      st.kill();
    };
  }, []);

  return (
    <section id="atas" aria-label="Warkop Hits — datang">
      <div
        ref={videoWrapRef}
        className="relative h-[82svh] w-full overflow-hidden bg-ink"
      >
        {/* Slideshow Ken Burns — lapisan gerak yang dijamin jalan */}
        <div className="absolute inset-0 hidden md:block" aria-hidden="true">
          <Slideshow images={DESKTOP_SLIDES} reduced={reduced} />
        </div>
        <div className="absolute inset-0 md:hidden" aria-hidden="true">
          <Slideshow images={MOBILE_SLIDES} reduced={reduced} />
        </div>
        {showVideo ? (
          <>
            <video
              ref={videoRef}
              className="relative hidden h-full w-full object-cover md:block"
              src="/assets/desktop-16s.mp4"
              poster="/assets/poster-desktop-16s.jpg"
              muted
              loop
              playsInline
              autoPlay
              aria-label="Video suasana Warkop Hits: kios senja, jalan masuk, barista, dan makanan"
            />
            <video
              ref={videoMobileRef}
              className="relative block h-full w-full object-cover md:hidden"
              src="/assets/mobile-10s.mp4"
              poster="/assets/poster-mobile-10s.jpg"
              muted
              loop
              playsInline
              autoPlay
              aria-label="Video suasana Warkop Hits: kios senja, interior, dan makanan"
            />
          </>
        ) : null}
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:pt-14">
        <p className="mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold">
          <span className="rounded-full bg-orange px-3 py-1 text-onorange">
            {site.hoursLabel}
          </span>
          <span className="rounded-full border border-ink/25 px-3 py-1">
            {site.locationShort}
          </span>
        </p>
        <h1 className="font-display text-[13vw] font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
          Masuk.
          <br />
          Duduk. Ngopi.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75 sm:text-xl">
          {site.heroSub} Satu malam nongkrong di Warkop Hits — dari trotoar,
          masuk lewat pintu terbuka, duduk, dan pesan yang bikin betah.
        </p>
        <div className="mt-8">
          <a
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#menu");
              if (!el) return;
              if (window.__lenis) {
                window.__lenis.scrollTo(el as HTMLElement, { offset: -72 });
              } else {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-base font-bold text-onorange shadow-lg shadow-orange/30 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {site.heroCta} ↓
          </a>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-ink/50">
          Video di atas adalah render konsep — gambaran suasana kios, bukan
          foto kios yang sudah buka.
        </p>
      </div>
    </section>
  );
}
