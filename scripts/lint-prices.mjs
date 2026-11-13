// lint:prices — gagalkan build kalau ada harga / nomor telp / WA
// di luar lib/site-data.ts (satu-satunya sumber fakta).
// Dijalankan otomatis sebagai `prebuild` (lihat package.json).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCAN_DIRS = ["app", "components", "lib"];
const PRICE_FILE = join("lib", "site-data.ts");

const checks = [
  { name: "nomor WhatsApp (wa.me)", re: /wa\.me/i },
  { name: "nomor telp 628", re: /628\d/ },
  { name: "kata WhatsApp", re: /whatsapp/i },
  { name: "harga literal (Rp + angka)", re: /Rp\s*\d/ },
  { name: "harga literal (format ribuan)", re: /\b\d{1,2}\.\d{3}\b/ },
  { name: "menu karangan (Roti Bakar)", re: /roti bakar/i },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|css|md)$/.test(entry)) out.push(p);
  }
  return out;
}

let failed = false;
for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    const text = readFileSync(file, "utf8");
    for (const { name, re } of checks) {
      // Harga literal BOLEH hanya di site-data.ts.
      if (rel === PRICE_FILE && name.startsWith("harga literal")) continue;
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        if (re.test(line)) {
          console.error(`LINT GAGAL [${name}] ${rel}:${i + 1}: ${line.trim()}`);
          failed = true;
        }
      });
    }
  }
}

if (failed) {
  console.error(
    "\nlint:prices gagal — pindahkan harga/nomor ke lib/site-data.ts (atau hapus).",
  );
  process.exit(1);
}
console.log("lint:prices OK — tidak ada harga/nomor di luar site-data.ts.");
