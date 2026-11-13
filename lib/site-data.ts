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
};

export const indomie: MenuItem[] = [
  {
    name: "Indomie Nyemek Telur Keju",
    price: 15000,
    desc: "Nyemek gurih, telur + taburan keju. Paling laku buat nugas malam.",
    tag: "Paling laku",
  },
  {
    name: "Indomie Goreng Sosis Mozzarella",
    price: 17000,
    desc: "Indomie goreng, sosis, mozzarella leleh — cheese pull-nya foto-able.",
  },
  {
    name: "Indomie Kuah Pedas Ayam Suwir",
    price: 13000,
    desc: "Kuah pedas hangat, ayam suwir + telur. Paling murah di kategori mie.",
  },
  {
    name: "Indomie Rendang Pedas Telur",
    price: 14000,
    desc: "Bumbu rendang instan, telur, bawang goreng. Gurih pedas.",
  },
];

export const gorengan: MenuItem[] = [
  {
    name: "Pisang Goreng Crispy Gula Aren",
    price: 10000,
    desc: "Pisang kepok crispy, siraman gula aren. Manisnya pas.",
  },
  {
    name: "Tahu Crispy Sambal Kecap",
    price: 10000,
    desc: "Tahu garing di luar, lembut di dalam, sambal kecap.",
  },
  {
    name: "Kentang Goreng Saus Keju",
    price: 12000,
    desc: "Kentang golden, saus keju lumer di atasnya.",
  },
  {
    name: "Cireng Bumbu Rujak",
    price: 10000,
    desc: "Cireng garing + bumbu rujak. Renyah, rasa juara.",
    tag: "Favorit",
  },
];

export const manis: MenuItem[] = [
  {
    name: "Es Coklat Jumbo",
    price: 10000,
    desc: "Coklat pekat, susu, es banyak. Cup jumbo buat yang haus berat.",
  },
];

export const minuman: MenuItem[] = [
  {
    name: "Es Kopi Susu Gula Aren",
    price: 10000,
    desc: "Kopi robusta, gula aren, susu — hero-nya Warkop Hits.",
    tag: "Hero",
  },
  {
    name: "Es Kopi Cokelat Hazelnut",
    price: 12000,
    desc: "Kopi + cokelat + hazelnut. Manisnya kalem.",
  },
  {
    name: "Es Americano Gula Cair",
    price: 8000,
    desc: "Kopi doang, gula cair, es. Buat yang mau kopi beneran.",
  },
  {
    name: "Es Coklat Klasik",
    price: 10000,
    desc: "Coklat + susu, klasik dan aman buat semua lidah.",
  },
  {
    name: "Es Taro / Matcha",
    price: 12000,
    desc: "Taro, matcha, atau red velvet — satu bubuk, tiga rasa.",
  },
  {
    name: "Es Milo Susu",
    price: 10000,
    desc: "Milo + susu. Rasa masa kecil, harga mahasiswa.",
  },
  {
    name: "Es Teh Jumbo Gula Batu",
    price: 8000,
    desc: "Teh tubruk + gula batu, cup jumbo. Pendamping wajib mie.",
    tag: "Paling laris",
  },
  {
    name: "Es Lemon Tea",
    price: 10000,
    desc: "Teh + lemon segar. Asem manis, nyegerin.",
  },
  {
    name: "Es Susu Regal Gula Aren",
    price: 15000,
    desc: "Susu + remahan Regal + gula aren. Buat konten, buat lidah.",
  },
  {
    name: "Es Coklat Lava Cheese",
    price: 18000,
    desc: "Coklat lava + cheese cream di atasnya. Paling foto-able.",
    tag: "Viral",
  },
];

export type Paket = {
  name: string;
  price: number;
  contents: string;
  desc: string;
};

export const paket: Paket[] = [
  {
    name: "Paket Nongkrong",
    price: 23000,
    contents: "Indomie Kuah Pedas Ayam Suwir + Cireng + Es Teh Jumbo",
    desc: "Buat sendiri, kenyang, hemat.",
  },
  {
    name: "Paket Kenyang",
    price: 27000,
    contents: "Indomie Nyemek Telur Keju + Kentang Saus Keju + Es Kopi Susu Gula Aren",
    desc: "Porsi paling pas buat habis nugas.",
  },
  {
    name: "Paket Ber-2",
    price: 43000,
    contents: "2 Indomie bebas pilih + 2 gorengan + 2 minuman",
    desc: "Buat berdua, nongkrong makin rame.",
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
