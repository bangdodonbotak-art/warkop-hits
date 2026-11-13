import { formatPrice, gorengan, indomie, manis, minuman, paket, site, type MenuItem } from "@/lib/site-data";
import CoffeeGlassShowcase from "@/components/CoffeeGlassShowcase";

/** Render 3D berlatar malam (menu-3d/*-malam-*.webp) per item — satu foto per item yang sesuai. */
const thumbs: Record<string, string> = {
  "Indomie Nyemek Telur Keju": "/assets/media-generation-3d-indomie-nyemek-malam-0-b4e8995a-328c-403c-a23b-75aa6f08f584.webp",
  "Indomie Goreng Sosis Mozzarella": "/assets/media-generation-3d-indomie-goreng-malam-0-1613ce76-3031-4acb-9f09-b941c4eedf3b.webp",
  "Es Coklat Lava Cheese": "/assets/media-generation-3d-es-coklat-lava-malam-0-dd5f8641-a005-4668-922c-c6563bd68f27.webp",
};

function Row({ item }: { item: MenuItem }) {
  const thumb = thumbs[item.name];
  return (
    <li className="flex gap-3 py-3">
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt=""
          aria-hidden="true"
          className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
          loading="lazy"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline">
          <span className="text-base font-semibold sm:text-lg">{item.name}</span>
          {item.tag ? (
            <span className="ml-2 shrink-0 rounded-full bg-orange px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-onorange">
              {item.tag}
            </span>
          ) : null}
          <span className="menu-leader" aria-hidden="true" />
          <span className="shrink-0 font-display text-base font-bold sm:text-lg">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink/60">
          {item.desc}
        </p>
      </div>
    </li>
  );
}

function Group({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-12 first:mt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-ink pb-3">
        <h3 className="font-display text-2xl font-bold sm:text-3xl">{title}</h3>
        {note ? <p className="text-sm text-ink/60">{note}</p> : null}
      </div>
      <ul className="divide-y divide-ink/10">{children}</ul>
    </div>
  );
}

/**
 * Chapter 4 — Menu sebagai DAFTAR BIASA.
 * Keputusan Dony 13 Nov 18:01 WIB: menu tampil biasa saja, tanpa stepper,
 * tanpa total, tanpa tombol pesan. Harga hanya dari lib/site-data.ts.
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
            <Row key={item.name} item={item} />
          ))}
        </Group>

        <Group title="Gorengan" note="Digoreng dadakan, bukan stok matang">
          {gorengan.map((item) => (
            <Row key={item.name} item={item} />
          ))}
        </Group>

        <Group title="Manis & Pendamping" note="Pasangan wajib mie panas">
          {manis.map((item) => (
            <Row key={item.name} item={item} />
          ))}
        </Group>
      </div>

      {/* Momen 3D (§12 blueprint): gelas Es Kopi 3D di samping daftar minuman.
          Showcase saja — bukan pemesanan, tanpa harga di sini. */}
      <div className="mt-14 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="md:sticky md:top-24 md:self-start">
          <CoffeeGlassShowcase />
        </div>
        <Group title="Minuman" note="Cup 22oz, kecuali Es Teh Jumbo">
          {minuman.map((item) => (
            <Row key={item.name} item={item} />
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
        <ul className="mt-6 divide-y divide-onorange/25">
          {paket.map((p) => (
            <li key={p.name} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-lg font-bold">{p.name}</span>
                <span className="shrink-0 font-display text-lg font-black">
                  {formatPrice(p.price)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-onorange/85">
                {p.contents} — {p.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
