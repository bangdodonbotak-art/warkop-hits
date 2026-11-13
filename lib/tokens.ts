// Design tokens — satu sumber (BLUEPRINT §5).
// Nilai yang sama juga didefinisikan sebagai CSS var di app/globals.css.
// Jangan tulis hex literal di komponen; import dari sini kalau butuh di JS.
export const tokens = {
  orange: "#E85D1F",
  ink: "#17120E",
  cream: "#F5EDE3",
  wood: "#8A5A33",
  textOnOrange: "#111111",
} as const;
