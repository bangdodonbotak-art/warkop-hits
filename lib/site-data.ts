// SATU-SATUNYA sumber fakta bisnis website Warkop Hits.
// Semua harga, jam, dan lokasi di website HARUS berasal dari file ini.
// Script lint:prices menggagalkan build kalau ada harga literal di luar file ini.
// Keputusan Dony 13 Nov 2026: tanpa nomor telp di mana pun.

export const site = {
  name: "Warkop Hits",
  tagline: "Nongkrong Hits, Harga Irit",
  heroTitle: "Masuk. Duduk. Ngopi.",
  heroSub: "Nongkrong Hits, Harga Irit — 10–18 ribu.",
  heroCta: "Lihat Menu",
  city: "Depok",
  region: "Jawa Barat",
  locationShort: "Depok, Jawa Barat",
  addressNote: "Alamat lengkap menyusul",
  hoursLabel: "Buka 24 Jam",
  hoursNote: "Buka setiap hari, 24 jam nonstop",
  description:
    "Warkop Hits — warkop kekinian di Depok buat mahasiswa dan anak nongkrong. Indomie hack, gorengan dadakan, dan es kopi susu gula aren. Nongkrong hits, harga irit.",
  priceNote: "10–18 ribu",
  siteUrl: "https://warkop-hits.vercel.app", // URL production Vercel (live 13 Nov 19:16 WIB)
} as const;

export type MenuItem = {
  name: string;
  price: number; // rupiah, angka saja — format tampil via formatPrice
  desc: string;
  tag?: string;
  image: string; // foto iklan produk di public/assets/menu-*.webp
};

export const indomie: MenuItem[] = [
  {
    name: "Indomie Nyemek Telur Keju",
    price: 15000,
    desc: "Nyemek gurih, telur + taburan keju. Paling laku buat nugas malam.",
    tag: "Paling laku",
    image: "/assets/menu-nyemek.webp",
  },
  {
    name: "Indomie Goreng Sosis Mozzarella",
    price: 17000,
    desc: "Indomie goreng, sosis, mozzarella leleh — cheese pull-nya foto-able.",
    image: "/assets/menu-goreng-sosis.webp",
  },
  {
    name: "Indomie Kuah Pedas Ayam Suwir",
    price: 13000,
    desc: "Kuah pedas hangat, ayam suwir + telur. Paling murah di kategori mie.",
    image: "/assets/menu-kuah-pedas.webp",
  },
  {
    name: "Indomie Rendang Pedas Telur",
    price: 14000,
    desc: "Bumbu rendang instan, telur, bawang goreng. Gurih pedas.",
    image: "/assets/menu-rendang.webp",
  },
];

export const gorengan: MenuItem[] = [
  {
    name: "Pisang Goreng Crispy Gula Aren",
    price: 10000,
    desc: "Pisang kepok crispy, siraman gula aren. Manisnya pas.",
    image: "/assets/menu-pisang-goreng.webp",
  },
  {
    name: "Tahu Crispy Sambal Kecap",
    price: 10000,
    desc: "Tahu garing di luar, lembut di dalam, sambal kecap.",
    image: "/assets/menu-tahu-crispy.webp",
  },
  {
    name: "Kentang Goreng Saus Keju",
    price: 12000,
    desc: "Kentang golden, saus keju lumer di atasnya.",
    image: "/assets/menu-kentang-keju.webp",
  },
  {
    name: "Cireng Bumbu Rujak",
    price: 10000,
    desc: "Cireng garing + bumbu rujak. Renyah, rasa juara.",
    tag: "Favorit",
    image: "/assets/menu-cireng.webp",
  },
];

export const manis: MenuItem[] = [
  {
    name: "Es Coklat Jumbo",
    price: 10000,
    desc: "Coklat pekat, susu, es banyak. Cup jumbo buat yang haus berat.",
    image: "/assets/menu-es-coklat-jumbo.webp",
  },
];

export const minuman: MenuItem[] = [
  {
    name: "Es Kopi Susu Gula Aren",
    price: 10000,
    desc: "Kopi robusta, gula aren, susu — hero-nya Warkop Hits.",
    tag: "Hero",
    image: "/assets/menu-es-kopi-susu.webp",
  },
  {
    name: "Es Kopi Cokelat Hazelnut",
    price: 12000,
    desc: "Kopi + cokelat + hazelnut. Manisnya kalem.",
    image: "/assets/menu-es-kopi-cokelat-hazelnut.webp",
  },
  {
    name: "Es Americano Gula Cair",
    price: 8000,
    desc: "Kopi doang, gula cair, es. Buat yang mau kopi beneran.",
    image: "/assets/menu-es-americano.webp",
  },
  {
    name: "Es Coklat Klasik",
    price: 10000,
    desc: "Coklat + susu, klasik dan aman buat semua lidah.",
    image: "/assets/menu-es-coklat-klasik.webp",
  },
  {
    name: "Es Taro / Matcha",
    price: 12000,
    desc: "Taro, matcha, atau red velvet — satu bubuk, tiga rasa.",
    image: "/assets/menu-es-taro-matcha.webp",
  },
  {
    name: "Es Milo Susu",
    price: 10000,
    desc: "Milo + susu. Rasa masa kecil, harga mahasiswa.",
    image: "/assets/menu-es-milo.webp",
  },
  {
    name: "Es Teh Jumbo Gula Batu",
    price: 8000,
    desc: "Teh tubruk + gula batu, cup jumbo. Pendamping wajib mie.",
    tag: "Paling laris",
    image: "/assets/menu-es-teh-jumbo.webp",
  },
  {
    name: "Es Lemon Tea",
    price: 10000,
    desc: "Teh + lemon segar. Asem manis, nyegerin.",
    image: "/assets/menu-es-lemon-tea.webp",
  },
  {
    name: "Es Susu Regal Gula Aren",
    price: 15000,
    desc: "Susu + remahan Regal + gula aren. Buat konten, buat lidah.",
    image: "/assets/menu-es-susu-regal.webp",
  },
  {
    name: "Es Coklat Lava Cheese",
    price: 18000,
    desc: "Coklat lava + cheese cream di atasnya. Paling foto-able.",
    tag: "Viral",
    image: "/assets/menu-es-coklat-lava.webp",
  },
];

export type Paket = {
  name: string;
  price: number;
  contents: string;
  desc: string;
  image: string; // foto iklan paket di public/assets/menu-paket-*.webp
};

export const paket: Paket[] = [
  {
    name: "Paket Nongkrong",
    price: 23000,
    contents: "Indomie Kuah Pedas Ayam Suwir + Cireng + Es Teh Jumbo",
    desc: "Buat sendiri, kenyang, hemat.",
    image: "/assets/menu-paket-nongkrong.webp",
  },
  {
    name: "Paket Kenyang",
    price: 27000,
    contents: "Indomie Nyemek Telur Keju + Kentang Saus Keju + Es Kopi Susu Gula Aren",
    desc: "Porsi paling pas buat habis nugas.",
    image: "/assets/menu-paket-kenyang.webp",
  },
  {
    name: "Paket Ber-2",
    price: 43000,
    contents: "2 Indomie bebas pilih + 2 gorengan + 2 minuman",
    desc: "Buat berdua, nongkrong makin rame.",
    image: "/assets/menu-paket-ber2.webp",
  },
];

export function formatPrice(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

/** Rentang harga buat JSON-LD — dihitung dari menu, bukan ditulis manual. */
export function priceRange(): string {
  const all = [...indomie, ...gorengan, ...manis, ...minuman, ...paket].map(
    (m) => m.price,
  );
  return `${formatPrice(Math.min(...all))} - ${formatPrice(Math.max(...all))}`;
}
