import { formatPrice, gorengan, indomie, manis, minuman, paket, site, type MenuItem, type Paket } from "@/lib/site-data";
import CoffeeGlassShowcase from "@/components/CoffeeGlassShowcase";

/**
 * Kartu foto satu item menu: foto iklan di atas (nama + harga sudah
 * tercetak di gambar), nama + harga di bawah dari lib/site-data.ts.
 * Foto 1920x1280 (3:2), lazy-load. Mobile 375px: 1 kolom — foto
 * tetap lebar penuh supaya teks di gambar masih kebaca.
 */
function Card({ item }: { item: MenuItem }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="aspect-[3/2] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {item.tag ? (
          <span className="absolute left-3 top-3 rounded-full bg-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-onorange shadow">
            {item.tag}
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-base font-bold leading-snug">{item.name}</h4>
          <span className="shrink-0 font-display text-lg font-black">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">
          {item.desc}
        </p>
      </div>
    </article>
  );
}

/** Kartu paket di dalam band oranye — badan kartu krem supaya kebaca. */
function PaketCard({ p }: { p: Paket }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-cream text-ink shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image}
        alt={p.name}
        className="aspect-[3/2] w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-base font-bold leading-snug">{p.name}</h4>
          <span className="shrink-0 font-display text-lg font-black">
            {formatPrice(p.price)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink/70">
          {p.contents} — {p.desc}
        </p>
      </div>
    </article>
  );
}

function Group({
  title,
  note,
  gridClass = "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
  children,
}: {
  title: string;
  note?: string;
  gridClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-12 first:mt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-ink pb-3">
        <h3 className="font-display text-2xl font-bold sm:text-3xl">{title}</h3>
        {note ? <p className="text-sm text-ink/60">{note}</p> : null}
      </div>
      <div className={gridClass}>{children}</div>
    </div>
  );
}

/**
 * Chapter 4 — Menu sebagai KARTU FOTO.
 * Keputusan Dony 13 Nov 19:33 WIB: "Masukin semua foto yg ada harganya,
 * ga cuma tulisan aja" — tiap item tampil dengan foto iklannya (nama +
 * harga tercetak di gambar) + nama + harga dari lib/site-data.ts.
 * Tetap tanpa stepper, tanpa total, tanpa tombol pesan (Racik Pesanan
 * dihapus total 13 Nov 18:01 WIB).
 */
export default function Menu() {
  return (
    <section id="menu" aria-label="Menu Warkop Hits" className="mx-auto max-w-5xl px-5 py-20">
      <h2 className="font-display text-4xl font-black leading-none sm:text-6xl">
        Menu
      </h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
        Semua {site.priceNote}. Indomie hack, gorengan dadakan, dan es kopi
        susu gula aren — harga final, langsung pesan di kasir.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/flatlay.webp"
          alt="Indomie, gorengan, dan es kopi di atas meja kayu — dari atas"
          className="aspect-[4/3] w-full rounded-3xl object-cover"
          loading="lazy"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/etalase-gorengan.webp"
          alt="Keranjang bambu berisi gorengan hangat dan es teh"
          className="aspect-[4/3] w-full rounded-3xl object-cover"
          loading="lazy"
        />
      </div>

      <div className="mt-14">
        <Group title="Indomie Hack" note="Level pedas 1–5, tambah topping tersedia di kasir">
          {indomie.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </Group>

        <Group title="Gorengan" note="Digoreng dadakan, bukan stok matang">
          {gorengan.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </Group>

        <Group title="Manis & Pendamping" note="Pasangan wajib mie panas">
          {manis.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </Group>
      </div>

      {/* Momen 3D (§12 blueprint): gelas Es Kopi 3D di samping kartu minuman.
          Showcase saja — bukan pemesanan, tanpa harga di sini. */}
      <div className="mt-14 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="md:sticky md:top-24 md:self-start">
          <CoffeeGlassShowcase />
        </div>
        <Group
          title="Minuman"
          note="Cup 22oz, kecuali Es Teh Jumbo"
          gridClass="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {minuman.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </Group>
      </div>

      <div className="mt-14 rounded-3xl bg-orange px-6 py-8 text-onorange sm:px-10">
        <h3 className="font-display text-2xl font-black sm:text-3xl">
          Paket Hemat
        </h3>
        <p className="mt-1 text-sm font-medium text-onorange/80">
          Buat yang mau kenyang tanpa mikir.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {paket.map((p) => (
            <PaketCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
