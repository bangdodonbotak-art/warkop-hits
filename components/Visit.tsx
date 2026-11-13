"use client";

import { site } from "@/lib/site-data";
import AmbientGlow from "@/components/AmbientGlow";

/**
 * Chapter 6 — Visit / Datang. Buka 24 jam, Depok.
 * Alamat jalan + titik Maps BELUM ADA — jangan karang alamat/peta.
 */
export default function Visit() {
  return (
    <section id="datang" aria-label="Datang ke Warkop Hits" className="relative overflow-hidden bg-ink py-20 text-cream">
      <AmbientGlow tone="night" />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-black leading-none sm:text-6xl">
            {site.hoursLabel}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/75">
            {site.hoursNote}. Lapar jam dua pagi? Pintu tetap terbuka.
          </p>
          <div className="mt-8 space-y-3 text-base">
            <p>
              <span className="font-semibold text-cream">Lokasi — </span>
              <span className="text-cream/80">{site.locationShort}</span>
            </p>
            <p className="text-cream/60">{site.addressNote}.</p>
          </div>
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
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-base font-bold text-onorange transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Lihat Menu ↑
          </a>
        </div>
        <div className="overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/kasir.webp"
            alt="Pelanggan membayar di kasir kayu, etalase gorengan di samping"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
