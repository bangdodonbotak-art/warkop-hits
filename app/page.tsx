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
