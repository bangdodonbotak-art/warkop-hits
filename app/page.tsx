import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WalkIn from "@/components/WalkIn";
import Bar from "@/components/Bar";
import Menu from "@/components/Menu";
import Hangout from "@/components/Hangout";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import AuroraGlow from "@/components/AuroraGlow";

/**
 * Warkop Hits — satu halaman, 6 chapter:
 * Hero → Jalan Masuk → Bar → Menu → Nongkrong → Visit.
 * Tanpa komponen pemesanan interaktif (dihapus total per keputusan Dony 13 Nov 18:01 WIB).
 *
 * Background dinamis — AURORA EMBER FULL-PAGE (keputusan Dony 13 Nov
 * 22:51 WIB: "background dari awal hingga akhir scroll aurora ember").
 * SATU layer AuroraGlow fixed di belakang seluruh halaman (z-0), semua
 * chapter transparan — tidak lagi setengah gelap setengah krem seperti
 * sebelumnya. Body dasar bg-ink, semua teks krem; kartu menu tetap
 * putih (papan menu) dan band Paket tetap oranye.
 */
export default function Home() {
  return (
    <>
      <AuroraGlow tone="night" className="pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10 min-h-full">
        <Nav />
        <main>
          <Hero />
          <WalkIn />
          <Bar />
          <Menu />
          <Hangout />
          <Visit />
        </main>
        <Footer />
      </div>
    </>
  );
}
