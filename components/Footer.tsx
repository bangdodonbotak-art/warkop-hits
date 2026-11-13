import Image from "next/image";
import { site } from "@/lib/site-data";
import AmbientGlow from "@/components/AmbientGlow";

/** Footer — jujur soal render konsep & status kios. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-ink pb-10 pt-14 text-cream">
      <AmbientGlow tone="night" />
      <div className="relative mx-auto max-w-5xl px-5">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/brand/favicon.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg"
          />
          <p className="font-display text-2xl font-black">{site.name}</p>
        </div>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-cream/70">
          {site.tagline}. {site.locationShort} — {site.hoursLabel}.
        </p>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/50">
          Semua foto dan video di website ini adalah render konsep — gambaran
          suasana kios, bukan foto kios yang sudah buka. Kios Warkop Hits
          segera hadir di Depok; foto asli akan menggantikan render saat kios
          buka.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/60">
          <a href="#menu" className="hover:text-cream">
            Menu
          </a>
          <a href="#nongkrong" className="hover:text-cream">
            Nongkrong
          </a>
          <a href="#datang" className="hover:text-cream">
            Datang
          </a>
        </div>
        <p className="mt-8 border-t border-cream/10 pt-6 text-xs text-cream/40">
          © 2026 {site.name} — {site.locationShort}
        </p>
      </div>
    </footer>
  );
}
