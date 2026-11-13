import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WalkIn from "@/components/WalkIn";
import Bar from "@/components/Bar";
import Menu from "@/components/Menu";
import Hangout from "@/components/Hangout";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";

/**
 * Warkop Hits — satu halaman, 6 chapter:
 * Hero → Jalan Masuk → Bar → Menu → Nongkrong → Visit.
 * Tanpa komponen pemesanan interaktif (dihapus total per keputusan Dony 13 Nov 18:01 WIB).
 *
 * Background dinamis (permintaan Dony 13 Nov 21:42 WIB, Aurora ember
 * dipilih 13 Nov 22:09 WIB): tiap chapter punya AuroraGlow sebagai anak
 * PERTAMA di dalam section-nya sendiri — bukan di wrapper luar — dan
 * blok headline Hero juga (tone night, teks jadi krem). Pelajaran
 * 13 Nov 21:53 WIB: glow di wrapper luar TIDAK kelihatan di chapter
 * gelap karena bg-ink section yang opaque menutupinya; di dalam section,
 * glow melayang DI ATAS bg tapi DI BAWAH konten. Tone "night" di
 * Hero/Bar/Visit/Footer, "cream" di Jalan Masuk/Menu/Nongkrong.
 */
export default function Home() {
  return (
    <div className="min-h-full">
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
  );
}
