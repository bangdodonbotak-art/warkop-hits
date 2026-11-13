import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WalkIn from "@/components/WalkIn";
import Bar from "@/components/Bar";
import Menu from "@/components/Menu";
import Hangout from "@/components/Hangout";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import AmbientGlow from "@/components/AmbientGlow";

/**
 * Warkop Hits — satu halaman, 6 chapter:
 * Hero → Jalan Masuk → Bar → Menu → Nongkrong → Visit.
 * Tanpa komponen pemesanan interaktif (dihapus total per keputusan Dony 13 Nov 18:01 WIB).
 *
 * Background dinamis (permintaan Dony 13 Nov 21:42 WIB): tiap chapter
 * kecuali Hero dibungkus GlowWrap — lapisan cahaya oranye/kayu yang
 * melayang pelan (AmbientGlow). Hero tidak dibungkus: videonya sudah
 * dinamis. Tone "night" di chapter gelap (Bar, Visit, Footer), "cream"
 * di chapter terang (Jalan Masuk, Menu, Nongkrong).
 */
function GlowWrap({
  tone,
  children,
}: {
  tone: "night" | "cream";
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <AmbientGlow tone={tone} />
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-full">
      <Nav />
      <main>
        <Hero />
        <GlowWrap tone="cream">
          <WalkIn />
        </GlowWrap>
        <GlowWrap tone="night">
          <Bar />
        </GlowWrap>
        <GlowWrap tone="cream">
          <Menu />
        </GlowWrap>
        <GlowWrap tone="cream">
          <Hangout />
        </GlowWrap>
        <GlowWrap tone="night">
          <Visit />
        </GlowWrap>
      </main>
      <GlowWrap tone="night">
        <Footer />
      </GlowWrap>
    </div>
  );
}
